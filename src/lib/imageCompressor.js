/**
 * Mengompres gambar secara otomatis di browser menggunakan HTML5 Canvas
 * Mengubah gambar besar (misal 3MB - 10MB dari kamera HP) menjadi ~40KB - 80KB
 * agar cepat di-upload dan muat disimpan dengan aman di Supabase.
 *
 * @param {File} file - File gambar dari input
 * @param {number} maxDimension - Batas lebar/tinggi maksimal (default: 1000px)
 * @param {number} quality - Kualitas kompresi JPEG 0.1 - 1.0 (default: 0.72)
 * @returns {Promise<{ dataUrl: string, originalSize: number, compressedSize: number }>}
 */
export async function compressImage(file, maxDimension = 1000, quality = 0.72) {
  if (!file) throw new Error("Tidak ada file yang dipilih");

  if (!file.type.startsWith("image/")) {
    throw new Error("File harus berupa gambar (JPG, PNG, JPEG, WebP)");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Gagal membaca file gambar"));

    reader.onload = (event) => {
      const img = new Image();

      img.onerror = () => reject(new Error("Gagal memproses gambar"));

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Skalakan proporsional jika melebihi maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Browser tidak mendukung kompresi canvas"));
          return;
        }

        // Background putih untuk menghindari area transparan PNG menjadi hitam
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Ekspor ke JPEG terkompresi
        const dataUrl = canvas.toDataURL("image/jpeg", quality);

        // Hitung estimasi ukuran hasil kompresi (dalam bytes)
        const base64Length = dataUrl.length - (dataUrl.indexOf(",") + 1);
        const compressedSize = Math.round((base64Length * 3) / 4);

        resolve({
          dataUrl,
          originalSize: file.size,
          compressedSize,
        });
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  });
}
