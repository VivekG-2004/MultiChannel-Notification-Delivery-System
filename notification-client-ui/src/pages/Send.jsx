import { useState, useEffect } from 'react'
import { sendNotification } from '../api/notifyApi'
import { getTemplates } from '../api/templateApi'
import { Send as SendIcon } from 'lucide-react'
import toast from 'react-hot-toast'

const CHANNELS = ['EMAIL', 'SMS', 'IN_APP', 'WEBHOOK']

const defaultForm = {
  channel: 'EMAIL',
  recipient: '',
  subject: '',
  body: '',
  templateId: '',
}

const Send = () => {
  const [form, setForm] = useState(defaultForm)
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(false)
  const [templatesLoading, setTemplatesLoading] = useState(true)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await getTemplates()
        setTemplates(res.data)
      } catch {
        toast.error('Failed to load templates')
      } finally {
        setTemplatesLoading(false)
      }
    }
    fetchTemplates()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleTemplateSelect = (e) => {
    const id = e.target.value
    if (!id) {
      setForm((prev) => ({ ...prev, templateId: '', subject: '', body: '' }))
      return
    }
    const selected = templates.find((t) => String(t.id) === id)
    if (selected) {
      setForm((prev) => ({
        ...prev,
        templateId: id,
        channel: selected.channel || prev.channel,
        subject: selected.subject || '',
        body: selected.body || '',
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const payload = {
      channel: form.channel,
      recipient: form.recipient,
      subject: form.subject,
      body: form.body,
      ...(form.templateId && { templateId: Number(form.templateId) }),
    }
    try {
      await sendNotification(payload)
      toast.success('Notification sent successfully!')
      setForm(defaultForm)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send notification')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Send Notification</h1>
        <p className="text-sm text-slate-400 mt-1">
          Fill the form below or pick a template to send a notification
        </p>
      </div>

      <div className="bg-[#1a1d27] rounded-xl border border-white/5 p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Template Picker */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Use a Template{' '}
              <span className="text-slate-500 font-normal">(optional)</span>
            </label>
            <select
              value={form.templateId}
              onChange={handleTemplateSelect}
              className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">— Select a template —</option>
              {templatesLoading ? (
                <option disabled>Loading...</option>
              ) : (
                templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.channel})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-xs text-slate-500">or fill manually</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Channel */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Channel
            </label>
            <div className="flex gap-2 flex-wrap">
              {CHANNELS.map((ch) => (
                <button
                  type="button"
                  key={ch}
                  onClick={() => setForm((prev) => ({ ...prev, channel: ch }))}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                    form.channel === ch
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-transparent text-slate-400 border-white/10 hover:border-indigo-500 hover:text-white'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          {/* Recipient */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Recipient
            </label>
            <input
              type="text"
              name="recipient"
              value={form.recipient}
              onChange={handleChange}
              required
              placeholder={
                form.channel === 'EMAIL'
                  ? 'user@example.com'
                  : form.channel === 'SMS'
                  ? '+91XXXXXXXXXX'
                  : form.channel === 'IN_APP'
                  ? 'userRef or userId'
                  : 'https://your-webhook-url.com'
              }
              className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Subject */}
          {form.channel !== 'SMS' && form.channel !== 'IN_APP' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Notification subject"
                className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Message Body
            </label>
            <textarea
              name="body"
              value={form.body}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Write your message here. Use {{placeholder}} for dynamic values."
              className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg text-sm transition disabled:opacity-60"
          >
            <SendIcon size={16} />
            {loading ? 'Sending...' : 'Send Notification'}
          </button>

        </form>
      </div>
    </div>
  )
}

export default Send