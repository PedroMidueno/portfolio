export const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)

  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'long',
    timeZone: 'America/Mexico_City'
  }).format(d)
}
