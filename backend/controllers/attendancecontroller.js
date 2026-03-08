import Attendance from "../models/attendancemodel.js";

// 1. Mark Attendance (Save or Update)
export const markAttendance = async (req, res) => {
    try {
        const { attendanceData } = req.body;

        if (!attendanceData || attendanceData.length === 0) {
            return res.json({ success: false, message: "Xog lama soo dirin!" });
        }

        // Soo qaado taariikhda (saacadaha ka saar)
        const targetDate = new Date(attendanceData[0].date || new Date());
        targetDate.setHours(0, 0, 0, 0);

        // MUHIIM: Tirtir xogtii hore ee maalintan si loogu beddelo tan cusub (Update)
        await Attendance.deleteMany({ date: targetDate });

        // Isku dubari xogta cusub oo ay ku jirto responsiblePhone
        const finalData = attendanceData.map(item => ({
            studentId: item.studentId,
            studentName: item.studentName,
            rollNumber: item.rollNumber,
            responsiblePhone: item.responsiblePhone, 
            status: item.status,
            date: targetDate
        }));

        await Attendance.insertMany(finalData);
        
        res.json({ success: true, message: "Xaadirinta si guul leh ayaa loo xareeyay!" });

    } catch (error) {
        res.json({ success: false, message: "Khalad: " + error.message });
    }
};

// 2. Get Attendance by Date
export const getAttendanceByDate = async (req, res) => {
    try {
        const { date } = req.query; 
        
        if (!date) {
            return res.json({ success: false, message: "Fadlan taariikhda soo geli" });
        }

        const searchDate = new Date(date);
        searchDate.setHours(0, 0, 0, 0);

        // Soo qaad xogta maalintaas (oo ay la socoto responsiblePhone)
        const report = await Attendance.find({ date: searchDate });
        
        res.json({ success: true, data: report }); 
        
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// 5. Get Attendance Summary (Top Absent Students)
export const getAttendanceSummary = async (req, res) => {
    try {
        // Waxaan soo qaadaynaa dhamaan xogta xaadirinta ee ah 'Absent'
        // Haddii aad rabto bisha hadda la joogo kaliya, waxaad ku dari kartaa filter-ka date-ka
        const absentRecords = await Attendance.find({ status: "Absent" });

        // Waxaan u habaynaynaa xogta si aan u tirino maqnaanshaha arday walba
        const summaryMap = {};

        absentRecords.forEach(record => {
            if (summaryMap[record.studentId]) {
                summaryMap[record.studentId].days += 1;
            } else {
                summaryMap[record.studentId] = {
                    name: record.studentName,
                    days: 1
                };
            }
        });

        // Waxaan u bedelaynaa Array, waxaan u kala saaraynaa inta ugu badan (Sort), 
        // waxaana soo qaadaynaa 5-ta ugu sareysa.
        const topAbsent = Object.values(summaryMap)
            .sort((a, b) => b.days - a.days)
            .slice(0, 5);

        res.json({ success: true, topAbsent });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};