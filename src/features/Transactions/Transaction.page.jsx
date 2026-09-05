import {ContainerBox} from "../../shared/utils/ContainerBox";
import {TransactionData} from "../../shared/utils/TransactionData";


export function TransactionsPage(){
    

    return(
        <>
       <div className="transaction-d-page">
        <ContainerBox>
                <h1>سجل المعاملات</h1>
                <h3>جميع العمليات المالية</h3>
            </ContainerBox>




 {TransactionData.map((transaction) => (
                <ContainerBox key={transaction.id} className="trans-container" >

                    <div className="transaction-title">
                        {transaction.title}
                    </div>

                    <div className="transaction-amount">
                        {transaction.amount} {transaction.currency}
                    </div>

                    <div className="transaction-from">
                        من: {transaction.from}
                    </div>

                    <div className="transaction-to">
                        إلى: {transaction.to}
                    </div>

                    <div className="transaction-status">
                        {transaction.status}
                    </div>

                    <div className="transaction-date">
                        {transaction.date}
                    </div>

                </ContainerBox>
            ))}       

</div> 
        </>
    );
}

// It must to be Transaction Data but I use {NotificationData } for test 