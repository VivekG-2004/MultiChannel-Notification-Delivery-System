const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-48">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default LoadingSpinner