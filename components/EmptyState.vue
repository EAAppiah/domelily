export const EmptyState = ({ icon, title, subtitle }) => {
  return `
    <div class="text-center py-8 text-gray-500">
      ${icon}
      <p class="text-lg font-medium">${title}</p>
      ${subtitle ? `<p class="text-sm">${subtitle}</p>` : ''}
    </div>
  `
}