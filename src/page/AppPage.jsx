
import { useState } from 'react'
import PlayerName from '../component/PlayerName'
import RightPanal from '../component/RightPanal'
import HomePage from '../page/HomePage'
import { useSelector } from 'react-redux';

function AppPage() {
    const [popupForm, setPopupForm] = useState(true);
    const { playername } = useSelector((state) => state.user)
    console.log('playername from redux store', playername);

    return (
        <>
            <div className='flex justify-between bg-slate-100'>
                {popupForm && <PlayerName setPopupForm={setPopupForm} />}

                <RightPanal playername={playername[0] ||[]} />
                <HomePage />
                <RightPanal playername={playername[1] || []} />
            </div>
        </>
    )
}

export default AppPage
