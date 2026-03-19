import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function getFileIcon(extension: string): string {
  const iconMap: Record<string, string> = {
    'js': 'file-code',
    'ts': 'file-code',
    'tsx': 'file-code',
    'jsx': 'file-code',
    'json': 'file-json',
    'css': 'file-code',
    'scss': 'file-code',
    'html': 'file-code',
    'md': 'file-text',
    'txt': 'file-text',
    'pdf': 'file-text',
    'png': 'file-image',
    'jpg': 'file-image',
    'jpeg': 'file-image',
    'gif': 'file-image',
    'svg': 'file-image',
    'mp4': 'file-video',
    'mp3': 'file-audio',
    'wav': 'file-audio',
    'zip': 'file-archive',
    'tar': 'file-archive',
    'gz': 'file-archive',
  };
  
  return iconMap[extension.toLowerCase()] || 'file';
}

export function getLanguageColor(language: string): string {
  const colorMap: Record<string, string> = {
    'JavaScript': 'text-yellow-400',
    'TypeScript': 'text-blue-400',
    'Python': 'text-green-400',
    'Java': 'text-red-400',
    'C++': 'text-blue-300',
    'C#': 'text-purple-400',
    'Go': 'text-cyan-400',
    'Rust': 'text-orange-400',
    'Ruby': 'text-red-500',
    'PHP': 'text-purple-600',
    'Swift': 'text-orange-300',
    'Kotlin': 'text-purple-300',
  };
  
  return colorMap[language] || 'text-gray-400';
}

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
  // Simple toast implementation
  const toast = document.createElement('div');
  toast.className = cn(
    'fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50',
    'transform transition-all duration-300 ease-in-out',
    'animate-in slide-in-from-bottom-2',
    type === 'success' ? 'bg-green-500 text-white' : 
    type === 'error' ? 'bg-red-500 text-white' : 
    'bg-blue-500 text-white'
  );
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('opacity-0');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}