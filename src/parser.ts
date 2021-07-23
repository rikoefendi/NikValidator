import { findById, DistrictContract, CityContract, ProvinceContract } from './address'
const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
]
type ValueOf<T> = T[keyof T]

type PartNik = {
    'province': [number, number],
    'city': [number, number],
    'district': [number, number],
    'date': [number, number],
    'month': [number, number],
    'year': [number, number],
    'uniqcode': [number, number]
}

export interface NIKResult {
    NIK: String
    province: ProvinceContract,
    city: CityContract,
    district: DistrictContract
    birthday: String | boolean
    gender: String
    unicode: String
    name: string | undefined
}

export class ParseNIK {
    private date: String
    private month: String
    private year: String
    private lahir: String | boolean
    private gender: String
    private province: ProvinceContract
    private city: CityContract
    private district: DistrictContract
    private uniqcode: String
    private NIK: String
    constructor(nik: String, public name?: string) {
        if (typeof nik === 'number') nik = String(nik)
        this.NIK = nik
        let { date, gender } = this.getDateAndGender()
        this.month = this.normalizeZero(this.getPartNIK('month'))
        this.year = this.normalizeYear();
        this.date = date;


        this.province = this.getArea('province') as ProvinceContract
        this.city = this.getArea('city') as CityContract
        this.district = this.getArea('district') as DistrictContract
        this.lahir = this.getBirthDay()
        this.gender = gender
        this.uniqcode = this.getUniqCode()
    }

    private getPartNIK(part: keyof PartNik): number {
        const partNIK: PartNik = {
            'province': [0, 2],
            'city': [0, 4],
            'district': [0, 6],
            'date': [6, 8],
            'month': [8, 10],
            'year': [10, 12],
            'uniqcode': [12, 16]
        }
        const NIK = this.NIK
        const order: ValueOf<PartNik> = partNIK[part]
        return Number(NIK.substring(order[0], order[1]))
    }
    private getArea(area) {
        const areas = { 'province': 'provinces', 'city': 'cities', 'district': 'districts' }
        return findById(areas[area], this.getPartNIK(area))
    }
    private getCurrentYear() {
        return parseInt(new Date().getFullYear().toString().substr(-2));
    }

    private getDateAndGender() {
        let date = this.getPartNIK('date')

        let gender = 'LAKI-LAKI'
        if (date > 40) {
            gender = 'PEREMPUAN'
            date -= 40
        }

        return { date: this.normalizeZero(date), gender }
    }
    private normalizeZero(number: Number): String {
        return number > 10 ? number.toString() : `0${number}`
    }
    private getBirthDay(): String | boolean {
        const month = Number(this.month) - 1
        if (Number(this.date) > 31 || month > 11) return false
        return `${this.date} ${monthNames[month]} ${this.year}`
    }
    private normalizeYear() {
        const nikYear = this.getPartNIK('year')
        const currentYear = this.getCurrentYear()
        return nikYear < currentYear
            ? `20${nikYear > 10 ? nikYear : '0' + nikYear.toString()}`
            : `19${nikYear > 10 ? nikYear : '0' + nikYear.toString()}`;
    }
    private getUniqCode() {
        let code = this.getPartNIK('uniqcode').toString()
        if (code.length >= 4) return code
        const length = 4 - code.length
        for (let i = 0; i < length; i++) {
            code = 0 + code
        }
        return code
    }
    isValid() {
        return this.NIK.length === 16 && !!this.province && !!this.city && !!this.district && !!this.lahir
    }

    parse(): NIKResult {
        return {
            NIK: this.NIK,
            province: this.province,
            city: this.city,
            district: this.district,
            birthday: this.lahir,
            gender: this.gender,
            unicode: this.uniqcode,
            name: this.name
        }
    }

}
