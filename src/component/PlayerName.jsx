import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {setPlayerName} from '../store/UserSlice'
const PlayerName = ({ setPopupForm }) => {
    const dispatch = useDispatch();

    const [playernames, setplayernames] = useState([]);
    const [playerNo, setPlayerNo] = useState(1);
    const onsubmit = (e) => {
        e.preventDefault();
        // console.log('form submitted name',e.target.name.value);
        const radomNum = Math.floor(1000 + Math.random() * 9000);
       
        setplayernames([...playernames, { id: radomNum, name: e.target.name.value,player: playerNo}]);
        e.target.reset();
        setPlayerNo(playerNo + 1);

    }

    useEffect(() => {
        console.log('playernames updated', playernames);
        dispatch(setPlayerName(playernames));
    }, [playernames]);

    if (playernames.length === 2) {
        setPopupForm(false);
    }



    return (
        <div className='absolute w-full bg-black/50 h-screen'>
            <div className=' absolute left-1/2 top-4 bg-white max-w-max p-5 rounded-2xl transform -translate-x-1/2'>
                <div>
                    <h3>{playernames.length === 0 ? "First Player" : "Second Player"}</h3>
                </div>
                <form className='' onSubmit={(e) => onsubmit(e)}>
                    <label htmlFor="" className='pr-4'>Name</label>
                    <input type="text" name='name' onChange={(e) => onchange(e)} placeholder='Enter Your Name' className='border-2 border-gray-300 rounded p-2 focus:outline-blue-400 focus:ring-2 focus:ring-violet-500' />
                    <button type='submit' className='bg-blue-500 p-2 rounded-xl m-2'>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default PlayerName
