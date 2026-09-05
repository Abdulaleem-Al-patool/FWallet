export const NotificationData = [
    {
        userId: "usr_fwallet_01",
        title: "اكتمال التحويل بنجاح",
        message:
            "تم تحويل مبلغ 2,500.00 ريال بنجاح من حساب الأهلي إلى حساب الراجحي الجاري.",
        IsRead: false,
        date: new Date().toLocaleString("ar-SA"),
        type: "transfer",
        icon: "↔",
    },

    {
        userId: "usr_fwallet_02",
        title: "تأكيد مزامنة المزودات",
        message:
            "تمت مزامنة جميع الحسابات المربوطة بنجاح.",
        IsRead: true,
        date: new Date().toLocaleString("ar-SA"),
        type: "sync",
        icon: "↻",
    },

    {
        userId: "usr_fwallet_03",
        title: "إيداع مالي جديد عبر Webhook",
        message:
            "استقبل النظام إشعار إيداع 1,250.00 USD.",
        IsRead: false,
        date: new Date().toLocaleString("ar-SA"),
        type: "webhook",
        icon: "⚡",
    },

    {
        userId: "usr_fwallet_04",
        title: "تنبيه الموازنة",
        message:
            "اقترب الإنفاق من الحد المحدد للموازنة.",
        IsRead: true,
        date: new Date().toLocaleString("ar-SA"),
        type: "budget",
        icon: "⚠",
    },
];