import { useEffect, useState } from 'react'
import { createRequest } from '../services/utitlity';
import "./MainApp.css"

function MainApp() {
    let isFetching = false;
    const [currenciesList, setCurrenciesList] = useState([]);
    const [cryptosList, setCryptosList] = useState([]);

    const [crypto, setCrypto] = useState(null);
    const [currency, setCurrency] = useState(null)

    const [amount, setAmount] = useState(null);

    const [finalResult, setFinal] = useState(null);

    const changeAmount = () => {
        let timer = null;
        return (event) => {
            clearTimeout(timer);
            timer = setTimeout((value) => {
                setAmount(value);
            }, 150, event?.target?.value)
        }
    }

    const getExchange = async (event) => {
        if (isFetching) return;
        isFetching = true;
        event?.preventDefault();
        if (!currency || !crypto || !amount) return
        const query = `crypto=${crypto}&target=${currency}&amount=${amount}`;
        const result = await createRequest(`/exchangerate?${query}`)
        if (!isNaN(result?.convertedAmount)) setFinal(result?.convertedAmount)
        else setFinal('error')
        isFetching = false;
    }


    useEffect(() => {
        (async () => {
            const result = await createRequest('/details');
            if (result?.supportedCurrencies?.length) {
                setCurrenciesList(result?.supportedCurrencies);
                if (result.supportedCurrencies.includes('usd')) {
                    setCurrency('usd');
                } else setCurrency(result.supportedCurrencies[0]);
            }
            if (result?.cryptos?.length) {
                setCryptosList(result.cryptos);
                setCrypto(result.cryptos[0].id)
            }
        })()
    }, [])

    return (
        <div className='main-wrapper'>
            <div>
                <form className='main-form' onSubmit={getExchange}>
                    <div className='form-elements'>
                        <div className='crypto-wrapper'>
                            <label htmlFor="list1">
                                Cryptos
                            </label>
                            {
                                !cryptosList?.length && <p> No Crypto Found </p>
                            }
                            {!!cryptosList?.length &&
                                <div className='crypto-list'>
                                    <select id="list1" onChange={(event) => setCrypto(event.target.value)}>
                                        {
                                            cryptosList.map(item => <option key={`crypto-${item.id}`} value={item.id}> {item.name}  </option>)
                                        }
                                    </select>
                                </div>
                            }
                        </div>
                        <div className='curreny-wrapper'>
                            <label htmlFor="list2">
                                Currencies
                            </label>
                            {
                                !currenciesList?.length && <p> No Currency Found </p>
                            }
                            {!!currenciesList?.length &&
                                <div className='currency-list'>
                                    <select id="list2" onChange={(event) => setCurrency(event.target.value)}>
                                        {
                                            currenciesList.map((item, index) => <option key={`curr-${index}`} value={item}> {item}  </option>)
                                        }
                                    </select>
                                </div>
                            }
                        </div>
                        <div className='ammount-wrapper'>
                            <label>Enter Amount</label>
                            <input type='number' onChange={changeAmount()} />
                        </div>
                        <button type='submit'
                            disabled={!currency || !crypto || !amount}>
                            Check
                        </button>
                    </div>


                </form>
                <div className='details-wrapper'>
                    <p> Converted Amount :
                        <b className='result'>
                            {
                                finalResult === null && 'Enter Amount to Check'
                            }
                            {
                                finalResult !== null && !isNaN(Number(finalResult)) &&
                                finalResult
                            }
                            {
                                finalResult === 'error' && 'Sorry, cant find exhange rate!'
                            }
                        </b>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default MainApp
