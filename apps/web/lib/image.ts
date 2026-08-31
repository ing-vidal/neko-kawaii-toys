/**
 * Comprime una imagen en el cliente utilizando Canvas y devuelve un Blob.
 */
export function compressImageToBlob(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85,
  outputType = 'image/jpeg'
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calcular nuevas dimensiones manteniendo la relación de aspecto
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        // Si es JPEG, rellenar fondo blanco por si la original tenía transparencias
        if (outputType === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          outputType,
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Comprime la imagen y la sube al endpoint /api/admin/upload (Vercel Blob o storage local).
 * Devuelve la URL pública final de la imagen.
 */
export async function uploadImageFile(
  file: File,
  options?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    preservePng?: boolean;
  }
): Promise<string> {
  const isPng = file.type === 'image/png' && options?.preservePng;
  const outputType = isPng ? 'image/png' : 'image/jpeg';
  const extension = isPng ? 'png' : 'jpg';

  const blob = await compressImageToBlob(
    file,
    options?.maxWidth ?? 1200,
    options?.maxHeight ?? 1200,
    options?.quality ?? 0.85,
    outputType
  );

  const cleanName = file.name.replace(/\.[^/.]+$/, '');
  const filename = `${cleanName}.${extension}`;

  const res = await fetch(`/api/admin/upload?filename=${encodeURIComponent(filename)}`, {
    method: 'POST',
    body: blob,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Error al subir imagen (HTTP ${res.status})`);
  }

  const data = (await res.json()) as { url: string };
  return data.url;
}

/**
 * Comprime una imagen en el cliente utilizando Canvas y devuelve un string Base64.
 * (Mantenido por compatibilidad).
 */
export function compressImage(
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}
