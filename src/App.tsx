import { useState, useEffect } from 'react';
import { Calculator, Save, RefreshCw, Info, CheckCircle, TrendingUp, DollarSign, BookOpen, Table, ChevronRight } from 'lucide-react';

interface TaxBracket {
    min: number;
    max: number;
    rate: number;
}

const TAX_BRACKETS: TaxBracket[] = [
    { min: 0, max: 150000, rate: 0 },
    { min: 150001, max: 300000, rate: 0.05 },
    { min: 300001, max: 500000, rate: 0.10 },
    { min: 500001, max: 750000, rate: 0.15 },
    { min: 750001, max: 1000000, rate: 0.20 },
    { min: 1000001, max: 2000000, rate: 0.25 },
    { min: 2000001, max: 5000000, rate: 0.30 },
    { min: 5000001, max: Infinity, rate: 0.35 },
];

function App() {
    // Navigation State
    const [activeTab, setActiveTab] = useState<'calculator' | 'rates' | 'knowledge'>('calculator');

    // Income
    const [salary, setSalary] = useState<number>(0);
    const [bonus, setBonus] = useState<number>(0);
    const [otherIncome, setOtherIncome] = useState<number>(0);

    // Deductions
    const [socialSecurity, setSocialSecurity] = useState<number>(9000);
    const [providentFund, setProvidentFund] = useState<number>(0);
    const [lifeInsurance, setLifeInsurance] = useState<number>(0);
    const [otherDeductions] = useState<number>(60000); // Personal deduction standard 60k

    // Results
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalDeductions, setTotalDeductions] = useState(0);
    const [netIncome, setNetIncome] = useState(0);
    const [taxPayable, setTaxPayable] = useState(0);

    useEffect(() => {
        calculateTax();
    }, [salary, bonus, otherIncome, socialSecurity, providentFund, lifeInsurance, otherDeductions]);

    const calculateTax = () => {
        // 1. Total Income
        const income = (salary * 12) + bonus + otherIncome;
        setTotalIncome(income);

        // 2. Expenses (Standard Deduction: 50% but max 100,000)
        const expenses = Math.min(income * 0.5, 100000);

        // 3. Total Deductions
        const deductions = expenses + socialSecurity + providentFund + lifeInsurance + otherDeductions;
        setTotalDeductions(deductions);

        // 4. Net Income
        const net = Math.max(income - deductions, 0);
        setNetIncome(net);

        // 5. Calculate Tax
        let calculatedTax = 0;

        for (let i = 0; i < TAX_BRACKETS.length; i++) {
            const b = TAX_BRACKETS[i];
            const prevMax = b.min === 0 ? 0 : b.min - 1;
            const currentMax = b.max;

            if (net > prevMax) {
                const taxableAmount = Math.min(net, currentMax) - prevMax;
                const taxInBracket = taxableAmount * b.rate;
                calculatedTax += taxInBracket;
            }
        }

        setTaxPayable(calculatedTax);
    };

    const formatMoney = (amount: number) => {
        return amount.toLocaleString('th-TH', { style: 'currency', currency: 'THB' });
    };

    // Components for different tabs
    const renderTaxRates = () => (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <Table className="w-6 h-6 text-primary-600" />
                ตารางอัตราภาษีเงินได้บุคคลธรรมดา
            </h2>
            <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-primary-50 text-primary-900">
                            <th className="p-4 font-bold border-b border-primary-100">เงินได้สุทธิ (บาท)</th>
                            <th className="p-4 font-bold border-b border-primary-100">อัตราภาษี</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-600">
                        {TAX_BRACKETS.map((b, index) => (
                            <tr key={index} className="odd:bg-white even:bg-slate-50 hover:bg-primary-50/50 transition-colors">
                                <td className="p-4 border-b border-slate-100">
                                    {b.min.toLocaleString()} - {b.max === Infinity ? 'ขึ้นไป' : b.max.toLocaleString()}
                                </td>
                                <td className="p-4 border-b border-slate-100 font-semibold text-primary-700">
                                    {b.rate === 0 ? 'ยกเว้น' : `${b.rate * 100}%`}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="mt-4 text-sm text-slate-500 text-center">
                * ข้อมูลตามเกณฑ์ภาษีปีปัจจุบัน (คำนวณแบบขั้นบันได)
            </p>
        </div>
    );

    const renderKnowledge = () => (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800">คลังความรู้เรื่องภาษี</h2>
                <p className="text-slate-500 mt-2">รวมเรื่องต้องรู้ก่อนยื่นภาษี เพื่อการวางแผนการเงินที่ดี</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-primary-700 flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5" />
                    ใครบ้างที่ต้องยื่นภาษี?
                </h3>
                <p className="text-slate-600 leading-relaxed">
                    ผู้ที่มี <strong>"เงินเดือน"</strong> เพียงอย่างเดียว หากรายได้ทั้งปีรวมกันเกิน <strong>120,000 บาท</strong> มีหน้าที่ต้องยื่นภาษี (แม้จะคำนวณแล้วไม่ต้องเสียภาษีก็ตาม)
                    <br /><br />
                    ส่วนผู้ที่มีรายได้ประเภทอื่น (เช่น ค้าขาย, ฟรีแลนซ์) หากรายได้เกิน 60,000 บาท ก็ต้องยื่นเช่นกัน
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-emerald-600 flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5" />
                    ค่าใช้จ่าย vs ค่าลดหย่อน ต่างกันยังไง?
                </h3>
                <ul className="text-slate-600 space-y-2 list-disc list-inside">
                    <li><strong>ค่าใช้จ่าย:</strong> หักอัตโนมัติตามประเภทรายได้ (เช่น เงินเดือนหักได้ 50% แต่ไม่เกิน 1 แสนบาท)</li>
                    <li><strong>ค่าลดหย่อน:</strong> สิทธิประโยชน์เพิ่มเติมที่เรานำมาใช้ลดภาษีได้ เช่น ประกันสังคม, กองทุน SF/RMF, ดอกเบี้ยบ้าน</li>
                </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-orange-500 flex items-center gap-2 mb-3">
                    <Info className="w-5 h-5" />
                    รายการลดหย่อนพื้นฐานมีอะไรบ้าง?
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-slate-600">
                    <div className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-1 text-primary-300" />
                        <span>ส่วนตัวผู้มีเงินได้: 60,000 บาท</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-1 text-primary-300" />
                        <span>ประกันสังคม: ตามจริง (สูงสุด 9,000)</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-1 text-primary-300" />
                        <span>บุตร: คนละ 30,000 บาท</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-1 text-primary-300" />
                        <span>บิดามารดา (อายุ 60+): ท่านละ 30,000</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCalculator = () => (
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Inputs */}
            <div className="lg:col-span-2 space-y-6">

                {/* Income Section */}
                <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary-600">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800">1. รายได้ (Income)</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">เงินเดือน (ต่อเดือน)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-semibold text-slate-800"
                                placeholder="0"
                                value={salary || ''}
                                onChange={e => setSalary(Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">โบนัส (ทั้งปี)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-semibold text-slate-800"
                                placeholder="0"
                                value={bonus || ''}
                                onChange={e => setBonus(Number(e.target.value))}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-600 mb-2">รายได้อื่นๆ (ทั้งปี)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-semibold text-slate-800"
                                placeholder="0"
                                value={otherIncome || ''}
                                onChange={e => setOtherIncome(Number(e.target.value))}
                            />
                        </div>
                    </div>
                </section>

                {/* Deductions Section */}
                <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800">2. ค่าลดหย่อน (Deductions)</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">ประกันสังคม (ทั้งปี)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-semibold text-slate-800"
                                value={socialSecurity}
                                onChange={e => setSocialSecurity(Number(e.target.value))}
                            />
                            <p className="text-xs text-slate-400 mt-1">*ปกติสูงสุด 9,000 บาท</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">ค่าลดหย่อนส่วนตัว</label>
                            <input
                                type="number"
                                disabled
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-semibold"
                                value={60000}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">กองทุนสำรองเลี้ยงชีพ (PVD)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-semibold text-slate-800"
                                value={providentFund || ''}
                                onChange={e => setProvidentFund(Number(e.target.value))}
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">เบี้ยประกันชีวิต</label>
                            <input
                                type="number"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-semibold text-slate-800"
                                value={lifeInsurance || ''}
                                onChange={e => setLifeInsurance(Number(e.target.value))}
                                placeholder="สูงสุด 100,000"
                            />
                        </div>
                    </div>
                </section>
            </div>

            {/* Right Column: Summary Card (Sticky) */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200 border border-slate-100 p-6 sticky top-8">
                    <div className="text-center mb-6">
                        <p className="text-slate-500 font-medium mb-1">ภาษีที่ต้องจ่าย (Tax Payable)</p>
                        <h2 className="text-4xl font-bold text-primary-600">{formatMoney(taxPayable)}</h2>
                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-bold">
                            <CheckCircle className="w-4 h-4" />
                            อัตราเฉลี่ย: {totalIncome > 0 ? ((taxPayable / totalIncome) * 100).toFixed(2) : 0}%
                        </div>
                    </div>

                    <div className="space-y-4 border-t border-slate-100 pt-6 text-sm">
                        <div className="flex justify-between items-center text-slate-600">
                            <span>รายได้รวมทั้งปี</span>
                            <span className="font-semibold text-slate-900">{formatMoney(totalIncome)}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600">
                            <span>หักค่าใช้จ่าย (50%)</span>
                            <span className="font-semibold text-emerald-600">-{formatMoney(Math.min(totalIncome * 0.5, 100000))}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600">
                            <span>หักค่าลดหย่อนรวม</span>
                            <span className="font-semibold text-emerald-600">-{formatMoney(totalDeductions - Math.min(totalIncome * 0.5, 100000))}</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                            <span className="font-bold text-slate-800">เงินได้สุทธิ (Net Income)</span>
                            <span className="font-bold text-primary-700 text-lg">{formatMoney(netIncome)}</span>
                        </div>
                    </div>

                    <button className="w-full mt-8 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center gap-2">
                        <Save className="w-5 h-5" />
                        บันทึกผลการคำนวณ
                    </button>

                    <button
                        onClick={() => {
                            setSalary(0); setBonus(0); setOtherIncome(0); setProvidentFund(0); setLifeInsurance(0);
                        }}
                        className="w-full mt-3 bg-white hover:bg-slate-50 text-slate-600 font-bold py-3 rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        เริ่มใหม่
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans">
            {/* Header */}
            <header className="bg-primary-900 text-white shadow-lg sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <Calculator className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Thai Tax Pro</h1>
                            <p className="text-xs text-slate-300">โปรแกรมคำนวณภาษีเงินได้บุคคลธรรมดา</p>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
                        <button
                            onClick={() => setActiveTab('calculator')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'calculator'
                                    ? 'bg-white text-primary-900 shadow-sm'
                                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Calculator className="w-4 h-4" />
                            คำนวณภาษี
                        </button>
                        <button
                            onClick={() => setActiveTab('rates')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'rates'
                                    ? 'bg-white text-primary-900 shadow-sm'
                                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Table className="w-4 h-4" />
                            ตารางอัตราภาษี
                        </button>
                        <button
                            onClick={() => setActiveTab('knowledge')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'knowledge'
                                    ? 'bg-white text-primary-900 shadow-sm'
                                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <BookOpen className="w-4 h-4" />
                            ความรู้ภาษี
                        </button>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {activeTab === 'calculator' && renderCalculator()}
                {activeTab === 'rates' && renderTaxRates()}
                {activeTab === 'knowledge' && renderKnowledge()}
            </main>
        </div>
    );
}

export default App;
