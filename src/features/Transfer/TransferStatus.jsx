import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getTransferStatus } from "./Transfer.Api";
import { useAuth } from "../../core/auth/AuthContext";

import "./TransferStatus.css";

export  function TransferStatus() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { state } = useLocation();

    const transferId = state?.transferId;

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["transfer-status", token, transferId],
        queryFn: () => getTransferStatus(token, transferId),
        enabled: !!token && !!transferId
    });

    const goToTransfer = () => navigate("/single-transfer");

    if (!transferId)
        return (
            <StateCard
                icon="!"
                title="حالة التحويل"
                message="لا توجد عملية تحويل لعرضها."
                button="العودة للتحويل"
                onClick={goToTransfer}
            />
        );

    if (isLoading)
        return (
            <StateCard
                loading
                title="حالة التحويل"
                message="جاري الحصول على حالة التحويل..."
            />
        );

    if (isError)
        return (
            <StateCard
                error
                icon="!"
                title="تعذر الحصول على حالة التحويل"
                message="حدث خطأ أثناء الحصول على بيانات العملية."
                errorMessage={error?.message}
                button="العودة للتحويل"
                onClick={goToTransfer}
            />
        );

    if (!data?.found)
        return (
            <StateCard
                icon="?"
                title="حالة التحويل"
                message="التحويل غير موجود."
                button="تحويل جديد"
                onClick={goToTransfer}
            />
        );

    const transfer = data.transfer;
    const transactions = data.transactions || [];

    const completed = transfer.status === "completed";
    const pending = transfer.status === "pending";

    const statusClass = completed
        ? "status-success"
        : pending
            ? "status-pending"
            : "status-failed";

    const statusText = completed
        ? "تم التحويل بنجاح"
        : pending
            ? "التحويل قيد المعالجة"
            : "التحويل لم يكتمل";

    return (
        <div className="transfer-status-page">
            <div className="transfer-status-container">

                <header className="status-header">
                    <div>
                        <h1>حالة التحويل</h1>
                        <p>متابعة نتيجة عملية التحويل وتفاصيلها</p>
                    </div>
                </header>

                <section className="status-main-card">
                    <div className={`transfer-status-badge ${statusClass}`}>
                        <span className="status-badge-icon">
                            {completed ? "✓" : pending ? "..." : "!"}
                        </span>
                        {statusText}
                    </div>

                    <div className="status-main-info">
                        <span>رقم العملية</span>
                        <strong>{transfer.id}</strong>
                    </div>
                </section>

                <section className="status-card">
                    <div className="status-card-header">
                        <h2>معلومات العملية</h2>
                    </div>

                    <div className="status-info-grid">
                        <Info
                            label="نوع العملية"
                            value={
                                transfer.type === "single"
                                    ? "تحويل فردي"
                                    : transfer.type
                            }
                        />

                        <Info
                            label="المبلغ"
                            value={
                                <strong className="status-amount">
                                    {transfer.requestedAmount}
                                    <small>{transfer.requestedCurrency}</small>
                                </strong>
                            }
                        />

                        <Info
                            label="الحالة"
                            value={
                                <strong className={statusClass}>
                                    {transfer.status}
                                </strong>
                            }
                        />
                    </div>
                </section>

                {transfer.type === "single" && (
                    <section className="status-card">
                        <div className="status-card-header">
                            <h2>تفاصيل التحويل</h2>
                        </div>

                        <div className="transfer-route">
                            <Account
                                label="الحساب المصدر"
                                value={transfer.source?.accountId}
                            />

                            <div className="route-arrow">←</div>

                            <Account
                                label="الحساب الوجهة"
                                value={transfer.destination?.accountId}
                            />
                        </div>
                    </section>
                )}

                <section className="status-card">
                    <div className="status-card-header">
                        <div>
                            <h2>العمليات الناتجة</h2>
                            <p>العمليات التي تم إنشاؤها نتيجة التحويل</p>
                        </div>

                        <span className="transaction-count">
                            {transactions.length}
                        </span>
                    </div>

                    {transactions.length ? (
                        <div className="transactions-list">
                            {transactions.map(transaction => (
                                <div
                                    className="transaction-item"
                                    key={transaction.id}
                                >
                                    <div className="transaction-header">
                                        <span>رقم العملية</span>
                                        <strong>{transaction.id}</strong>
                                    </div>

                                    <div className="transaction-grid">
                                        <Info
                                            label="المصدر"
                                            value={transaction.sourceAccountId}
                                        />

                                        <Info
                                            label="الوجهة"
                                            value={transaction.destinationAccountId}
                                        />

                                        <Info
                                            label="المبلغ"
                                            value={`${transaction.amount} ${transaction.currency}`}
                                        />

                                        <Info
                                            label="الحالة"
                                            value={transaction.status}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-transactions">
                            لا توجد عمليات مسجلة.
                        </div>
                    )}
                </section>

                <section className="status-actions">
                    <button
                        className="status-secondary-button"
                        onClick={() => navigate(-1)}
                    >
                        العودة
                    </button>

                    <button
                        className="status-primary-button"
                        onClick={goToTransfer}
                    >
                        تحويل جديد
                    </button>
                </section>

            </div>
        </div>
    );
}

function Info({ label, value }) {
    return (
        <div className="status-info-item">
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    );
}

function Account({ label, value }) {
    return (
        <div className="route-account">
            <span className="route-label">{label}</span>
            <strong>{value}</strong>
        </div>
    );
}

function StateCard({
    icon,
    title,
    message,
    button,
    onClick,
    loading,
    error,
    errorMessage
}) {
    return (
        <div className="transfer-status-page">
            <div className="transfer-status-container">
                <div className={`status-state-card ${error ? "status-error-state" : ""}`}>

                    {loading ? (
                        <div className="status-spinner" />
                    ) : (
                        <div className="status-state-icon">{icon}</div>
                    )}

                    <h1>{title}</h1>
                    <p>{message}</p>

                    {errorMessage && (
                        <div className="status-error-message">
                            {errorMessage}
                        </div>
                    )}

                    {button && (
                        <button
                            className="status-primary-button"
                            onClick={onClick}
                        >
                            {button}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

