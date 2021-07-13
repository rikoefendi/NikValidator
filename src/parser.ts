import { AddressContract, findById, KecamatanContract, KotaContract, ProvinsiContract } from './address'
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
    'provinsi': [number, number],
    'kota': [number, number],
    'kecamatan': [number, number],
    'date': [number, number],
    'month': [number, number],
    'year': [number, number],
    'uniqcode': [number, number]
}

class ParseNIK {
    private date: String
    private month: String
    private year: String
    public lahir: String | Boolean
    public gender: String
    public umur: String
    public provinsi: ProvinsiContract
    public kota: KotaContract
    public kecamatan: KecamatanContract
    public uniqcode: String
    constructor(public NIK: string) {
        let { date, gender } = this.getDateAndGender()
        this.month = this.normalizeZero(this.getPartNIK('month'))
        this.year = this.normalizeYear();
        this.date = date;


        this.provinsi = this.getArea('provinsi') as ProvinsiContract
        this.kota = this.getArea('kota') as KotaContract
        this.kecamatan = this.getArea('kecamatan') as KecamatanContract
        this.lahir = this.getBirthDay()
        this.gender = gender
        this.uniqcode = this.getUniqCode()
    }

    private getPartNIK(part: keyof PartNik): number {
        const partNIK: PartNik = {
            'provinsi': [0, 2],
            'kota': [0, 4],
            'kecamatan': [0, 6],
            'date': [6, 8],
            'month': [8, 10],
            'year': [10, 12],
            'uniqcode': [12, 16]
        }
        const NIK = this.NIK
        const order: ValueOf<PartNik> = partNIK[part]
        return Number(NIK.substring(order[0], order[1]))
    }
    private getArea(area: keyof AddressContract) {
        return findById(area, this.getPartNIK(area))
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
    private getBirthDay() {
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
    private validate() {
        return this.NIK.length === 16 && !!this.provinsi && !!this.kota && !!this.kecamatan && !!this.lahir
    }

    public parse() {
        if (!this.validate()) return false
        return {
            provinsi: this.provinsi.name,
            kota: this.kota.name,
            kecamatan: this.kecamatan.name,
            kodepos: this.kecamatan.postal_code,
            tgl_lahir: this.lahir,
            gender: this.gender,
            unicode: this.uniqcode,
            address_id: this.kecamatan.id
        }
    }

}

export function parseNIK(nik) {
    if (typeof nik == 'number') nik = String(nik)
    return new ParseNIK(nik).parse()
}