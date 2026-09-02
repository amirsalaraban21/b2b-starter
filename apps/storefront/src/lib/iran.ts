export const iranProvinces = [
  ["آذربایجان شرقی", "East Azerbaijan"], ["آذربایجان غربی", "West Azerbaijan"], ["اردبیل", "Ardabil"], ["اصفهان", "Isfahan"], ["البرز", "Alborz"], ["ایلام", "Ilam"], ["بوشهر", "Bushehr"], ["تهران", "Tehran"], ["چهارمحال و بختیاری", "Chaharmahal and Bakhtiari"], ["خراسان جنوبی", "South Khorasan"], ["خراسان رضوی", "Razavi Khorasan"], ["خراسان شمالی", "North Khorasan"], ["خوزستان", "Khuzestan"], ["زنجان", "Zanjan"], ["سمنان", "Semnan"], ["سیستان و بلوچستان", "Sistan and Baluchestan"], ["فارس", "Fars"], ["قزوین", "Qazvin"], ["قم", "Qom"], ["کردستان", "Kurdistan"], ["کرمان", "Kerman"], ["کرمانشاه", "Kermanshah"], ["کهگیلویه و بویراحمد", "Kohgiluyeh and Boyer-Ahmad"], ["گلستان", "Golestan"], ["گیلان", "Gilan"], ["لرستان", "Lorestan"], ["مازندران", "Mazandaran"], ["مرکزی", "Markazi"], ["هرمزگان", "Hormozgan"], ["همدان", "Hamadan"], ["یزد", "Yazd"],
] as const

const digitMap: Record<string, string> = { "۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9","٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9" }
export const normalizeDigits = (value: string) => value.replace(/[۰-۹٠-٩]/g, (digit) => digitMap[digit])
export const normalizeIranianMobile = (value: string) => { const digits = normalizeDigits(value).replace(/[^0-9+]/g, ""); const normalized = digits.replace(/^0098/, "+98").replace(/^98/, "+98").replace(/^0/, "+98"); return /^\+989\d{9}$/.test(normalized) ? normalized : null }
export const normalizeIranianPostalCode = (value: string) => normalizeDigits(value).replace(/\D/g, "")
export const isIranianPostalCode = (value: string) => /^\d{10}$/.test(normalizeIranianPostalCode(value))
