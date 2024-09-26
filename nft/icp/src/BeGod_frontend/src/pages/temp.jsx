{currentBuyingStatus === buyingStatus.deliveryInfo && (
    <div className='md:mt-5'> 
        <h1 className='text-2xl font-semibold'>Delivery Info.</h1>
        <div className='relative flex items-center my-3'>
            <img src="buynftimg2.png" className='absolute w-[150px] h-[160px] -left-10'/>
            <div className='ml-[50px]'>
                <h1 className='text-lg font-semibold'>Horse Collection</h1>
                <p className='text-sm font-extralight'>Hard Copy</p>
            </div>
        </div>
        <div className='flex items-center justify-between'>
                <div className='flex flex-col w-[40%] relative'>
                    <label className='text-lg font-semibold'>Phone No.<span className='text-red-700 absolute -top-1'>*</span></label>
                    <input type='number' className='bg-transparent border-0 border-b border-solid border-white' />
                </div>
                <div className='flex flex-col w-[40%] relative'>
                    <label className='text-lg font-semibold'>Email<span className='text-red-700  absolute -top-2'>*</span></label>
                    <input type='text' className='bg-transparent border-0 border-b border-solid border-white' />
                </div>
            </div>
            <h1  className='text-lg font-semibold mt-3'>Address</h1>
            <div className='flex items-center justify-between mb-3'>
                <div className='flex flex-col w-[35%] '>
                    <label className='text-sm font-extralight relative'>H No,St No<span className='text-red-700 absolute -top-1'>*</span></label>
                    <input type='text' className='bg-transparent border-0 border-b border-solid border-white' />
                </div>
                <div className='flex flex-col w-[35%]'>
                    <label className='text-sm font-extralight relative'>City<span className='text-red-700 absolute -top-1'>*</span></label>
                    <select className='bg-transparent border-b font-Quicksand' value={selectedCity} onChange={onChangeCity}>
                    <option value="" disabled hidden></option> {/* Empty option, hidden */}
                        {!selectedCountry ? (
                            <option value="" disabled className='bg-black font-Quicksand border-none border-0 text-white'>Select a country first</option>
                            ) : (
                                cityList.length === 0 ? (
                                <option value="" disabled>No cities available</option>
                            ) : (
                                cityList.map((eachCity) => (
                            <option value={eachCity.name} key={eachCity.name} className='bg-black font-Quicksand border-none border-0'>{eachCity.name}</option>
                            ))
                            )
                        )}
                    </select>
                </div>
                <div className='flex flex-col w-[20%] relative'>
                    <label className='text-sm font-extralight'>Country<span className='text-red-700 absolute -top-1'>*</span></label>
                    <select className='bg-transparent border-b font-Quicksand' value={selectedCountry} onChange={onChangeCoutry}>
                    <option value="" disabled hidden></option> {/* Empty option, hidden */}
                        {countries.map((eachCountry) => (
                           <option value={eachCountry.id} key={eachCountry.id} className='bg-black font-Quicksand border-none border-0'>{eachCountry.displayText}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className='flex items-center relative'>
            <div className='flex flex-col w-[35%]  mb-3 mr-9 '>
                    <label className='text-sm font-extralight'>Pincode<span className='text-red-700 absolute -top-1'>*</span></label>
                    <input type='text' className='bg-transparent border-0 border-b border-solid border-white' />
                </div>
                <div className='flex flex-col w-[35%]  mb-3'>
                    <label className='text-sm font-extralight'>Nearby LandMark(Optional)</label>
                    <input type='text' className='bg-transparent border-0 border-b border-solid border-white' />
                </div>
            </div>
            <div className=''>
                <p className='text-sm font-extralight'><span className='text-red-700 mr-2'>*</span>Mandatory Information</p>
            </div>
        <div className='flex justify-center'>
        <button  className='mt-3 w-40 border border-white border-solid cursor-pointer bg-[#1E62AC]'>Place Order</button>
        </div>
    </div>
)}

{currentBuyingStatus === buyingStatus.success && (
    <div className='h-[90%] relative flex flex-col items-center justify-center mt-10 '>
        <h1 className='text-2xl font-semibold'>Congratulations!!!</h1>
        <p className='text-sm mb-0'>You Unlocked</p>
        <img src='buynftimg.png' className='absolute size-64' />
        <h1 className='text-3xl font-bold font-caslon mt-[180px]'>Horse Collection</h1>
        <button onClick={()=>setBuyingStatus(buyingStatus.deliveryInfo)} className='mt-3 w-40 border border-white border-solid cursor-pointer bg-[#1E62AC]'>Get A Hard Copy</button>
    </div>
)}

const [buyPopup , setbuyPopup] = useState(false);
const [currentBuyingStatus , setBuyingStatus] = useState(buyingStatus.licenceInfo);
const [selectedCountry , updateSelectedCountry] = useState("")
const [selectedCity , updateSelectedCity] = useState("");

const countries = Country.getAllCountries().map((eachCountry) => ({
    id : eachCountry.isoCode,
    displayText : eachCountry.name,
}));

const [cityList,updateCityList] = useState([]);



const toggleBuyPopup  = () => {
    setbuyPopup(!buyPopup);
    setBuyingStatus(buyingStatus.success);
}

const onChangeCoutry = (event) => {
    console.log(event.target.value);
    const cities = City.getCitiesOfCountry(event.target.value);
    updateCityList(cities);
    updateSelectedCountry(event.target.value)
}

const onChangeCity = (event) => {
    if(cityList.length != 0){
        updateSelectedCity(event.target.value)
    }
}

// import { City, Country } from 'country-state-city'; 

// ${currentBuyingStatus === buyingStatus.deliveryInfo ? "w-[100vw] md:w-[95vw] lg:w-[50vw]" : "w-[70vw] lg:w-[30vw]"}