import { useState, useEffect } from 'react'
import { getTemplates, createTemplate, deleteTemplate } from '../api/templateApi'
import { Plus, Trash2, FileText } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import { getChannelColor } from '../utils/helpers'
import toast from 'react-hot-toast'

const CHANNELS = ['EMAIL', 'SMS', 'IN_APP', 'WEBHOOK']

const defaultForm = {
  name: '',
  channel: 'EMAIL',
  subject: '',
  body: '',
}

const Templates = () => {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const res = await getTemplates()
      setTemplates(res.data)
    } catch {
      toast.error('Failed to load templates')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTemplates() }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await createTemplate(form)
      toast.success('Template created!')
      setShowModal(false)
      setForm(defaultForm)
      fetchTemplates()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create template')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this template?')) return
    setDeletingId(id)
    try {
      await deleteTemplate(id)
      toast.success('Template deleted')
      setTemplates((prev) => prev.filter((t) => t.id !== id))
    } catch {
      toast.error('Failed to delete template')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Templates</h1>
          <p className="text-sm text-slate-400 mt-1">Manage reusable notification templates</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
        >
          <Plus size={16} />
          New Template
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : templates.length === 0 ? (
        <div className="bg-[#1a1d27] rounded-xl border border-white/5 p-12 text-center">
          <FileText size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No templates yet. Create your first one.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {templates.map((t) => (
            <div
              key={t.id}
              className="bg-[#1a1d27] rounded-xl border border-white/5 p-5 flex items-start justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white text-sm">{t.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getChannelColor(t.channel)}`}>
                    {t.channel}
                  </span>
                </div>
                {t.subject && (
                  <p className="text-xs text-slate-500 mb-1">
                    Subject: <span className="text-slate-300">{t.subject}</span>
                  </p>
                )}
                <p className="text-xs text-slate-500 truncate">{t.body}</p>
              </div>
              <button
                onClick={() => handleDelete(t.id)}
                disabled={deletingId === t.id}
                className="text-red-400 hover:text-red-300 transition shrink-0 disabled:opacity-50"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-[#1a1d27] border border-white/5 rounded-xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-lg font-bold text-white mb-4">New Template</h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Template Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Welcome Email"
                  className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Channel</label>
                <div className="flex gap-2 flex-wrap">
                  {CHANNELS.map((ch) => (
                    <button
                      type="button"
                      key={ch}
                      onClick={() => setForm((prev) => ({ ...prev, channel: ch }))}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
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

              {form.channel !== 'SMS' && form.channel !== 'IN_APP' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="e.g. Welcome to our platform"
                    className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Body</label>
                <textarea
                  name="body"
                  value={form.body}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Hello {{name}}, welcome to {{platform}}!"
                  className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Use {'{{placeholder}}'} syntax for dynamic values
                </p>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setForm(defaultForm) }}
                  className="flex-1 border border-white/10 text-slate-300 hover:bg-white/5 font-medium py-2.5 rounded-lg text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg text-sm transition disabled:opacity-60"
                >
                  {submitting ? 'Creating...' : 'Create Template'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Templates