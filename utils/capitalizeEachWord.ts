export function capitalizeEachWord(string: string) {
  if (typeof string !== "string" || string.length === 0) {
    return string;
  }

  // Ubah seluruh string menjadi huruf kecil terlebih dahulu
  const lowercasedString = string.toLowerCase();

  // Pisahkan string menjadi array kata-kata
  const words = lowercasedString.split(" ");

  // Kapitalisasi huruf pertama setiap kata dan gabungkan kembali
  const capitalizedWords = words.map((word) => {
    if (word.length === 0) {
      return ""; // Tangani spasi ganda atau kata kosong
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Gabungkan array kata-kata kembali menjadi satu string
  return capitalizedWords.join(" ");
}
