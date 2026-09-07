import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAccounts, validateSingleTransfer } from "./Transfer.Api";
import { useAuth } from "../../core/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "./SingleTransfer.css";

export default function SingleTransfer() {

    const navigate = useNavigate();
    const { token } = useAuth();

    const [sourceAccountId, setSourceAccountId] =
        useState("");

    const [destinationAccountId, setDestinationAccountId] =
        useState("");

    const [amount, setAmount] =
        useState("");

    const [validationError, setValidationError] =
        useState(null);

   // const [validatedTransfer, setValidatedTransfer] =useState(null);


    const {
        data: accounts = [],
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ["accounts", token],

        queryFn: () =>
            getAccounts(token),

        enabled: !!token
    });


  
async function handleSubmit(event) {

    event.preventDefault();

    setValidationError(null);

    const result =
        await validateSingleTransfer(
            token,
            {
                sourceAccountId,
                destinationAccountId,
                amount: Number(amount)
            }
        );


    if (!result.valid) {

        setValidationError(
            result.message
        );

        return;
    }


    navigate(
        "/transfer-confirmation",
        {
            state: {
                transfer: {
                    type: "single",

                    sourceAccount:
                        result.sourceAccount,

                    destinationAccount:
                        result.destinationAccount,

                    amount:
                        result.amount
                }
            }
        }
    );
}



    /* =====================================================
       Loading
       ===================================================== */

    if (isLoading) {

        return (
            <div className="transfer-state">

                <div className="state-card">

                    <h2>
                        جاري تحميل الحسابات
                    </h2>

                    <p>
                        يرجى الانتظار قليلًا...
                    </p>

                </div>

            </div>
        );
    }


    /* =====================================================
       Error
       ===================================================== */

    if (isError) {

        return (
            <div className="transfer-state">

                <div className="state-card state-error">

                    <h2>
                        تعذر تحميل الحسابات
                    </h2>

                    <p>
                        {error?.message}
                    </p>

                </div>

            </div>
        );
    }


    /* =====================================================
       Not Enough Accounts
       ===================================================== */

    if (accounts.length < 2) {

        return (
            <div className="transfer-state">

                <div className="state-card">

                    <h2>
                        لا توجد حسابات كافية
                    </h2>

                    <p>
                        يجب أن يكون لديك حسابان على الأقل
                        لإجراء تحويل داخلي.
                    </p>

                </div>

            </div>
        );
    }


    /* =====================================================
       Selected Accounts
       ===================================================== */

    const sourceAccount =
        accounts.find(
            account =>
                String(account.id) ===
                String(sourceAccountId)
        );

    const destinationAccount =
        accounts.find(
            account =>
                String(account.id) ===
                String(destinationAccountId)
        );


    return (

        <div className="single-transfer-page">

            <div className="single-transfer-container">


                {/* =================================================
                   Header
                   ================================================= */}

                <header className="transfer-header">

                    <h1>
                        تحويل مالي جديد
                    </h1>

                    <p>
                        تحويل الأموال بين حساباتك
                    </p>

                </header>


                {/* =================================================
                   Main Card
                   ================================================= */}

                <div className="transfer-card">

                    <form
                        className="transfer-form"
                        onSubmit={handleSubmit}
                    >


                        {/* =============================================
                           Source Account
                           ============================================= */}

                        <div className="form-group">

                            <label
                                className="form-label"
                                htmlFor="source-account"
                            >
                                الحساب المصدر
                            </label>

                            <select
                                id="source-account"
                                className="form-select"
                                value={sourceAccountId}
                                onChange={event =>
                                    setSourceAccountId(
                                        event.target.value
                                    )
                                }
                                required
                            >

                                <option value="">
                                    اختر الحساب الذي سيتم الخصم منه
                                </option>

                                {accounts.map(account => (

                                    <option
                                        key={account.id}
                                        value={account.id}
                                    >

                                        {account.name}
                                        {" — "}
                                        {account.balance}
                                        {" "}
                                        {account.currency}

                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* =============================================
                           Direction
                           ============================================= */}

                        <div className="transfer-direction">

                            <div className="transfer-arrow">
                                ↓
                            </div>

                        </div>


                        {/* =============================================
                           Destination Account
                           ============================================= */}

                        <div className="form-group">

                            <label
                                className="form-label"
                                htmlFor="destination-account"
                            >
                                الحساب الوجهة
                            </label>

                            <select
                                id="destination-account"
                                className="form-select"
                                value={destinationAccountId}
                                onChange={event =>
                                    setDestinationAccountId(
                                        event.target.value
                                    )
                                }
                                required
                            >

                                <option value="">
                                    اختر الحساب الذي سيتم التحويل إليه
                                </option>

                                {accounts.map(account => (

                                    <option
                                        key={account.id}
                                        value={account.id}
                                    >

                                        {account.name}
                                        {" — "}
                                        {account.currency}

                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* =============================================
                           Amount
                           ============================================= */}

                        <div className="form-group">

                            <label
                                className="form-label"
                                htmlFor="transfer-amount"
                            >
                                المبلغ
                            </label>

                            <div className="amount-wrapper">

                                <input 
                                    dir="ltr"
                                    id="transfer-amount"
                                    className="form-input"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={event =>
                                        setAmount(
                                            event.target.value
                                        )
                                    }
                                    required
                                />

                                {sourceAccount && (

                                    <span dir="ltr" className="amount-currency">

                                        {sourceAccount.currency}

                                    </span>

                                )}

                            </div>

                        </div>


                        {/* =============================================
                           Validation Error
                           ============================================= */}

                        {validationError && (

                            <div className="validation-error">

                                {validationError}

                            </div>

                        )}


                        {/* =============================================
                           Submit
                           ============================================= */}

                        <button
                            className="review-button"
                            type="submit"
                        >
                            مراجعة التحويل
                        </button>

                    </form>


                   
                </div>

            </div>

        </div>
    );
}


