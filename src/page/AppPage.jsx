
import { useState } from 'react'
import PlayerName from '../component/PlayerName'
import RightPanal from '../component/RightPanal'
import HomePage from '../page/HomePage'
import { useSelector } from 'react-redux';
import LeftPanal from '../component/LeftPanal';

function AppPage() {
    const [popupForm, setPopupForm] = useState(true);
    const { playername } = useSelector((state) => state.user)

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-8 bg-slate-100 min-h-screen">
                {popupForm && <PlayerName setPopupForm={setPopupForm} />}

                {/* HomePage - Top on mobile, center on sm+ */}
                <div className="order-1 sm:order-2 col-span-2 sm:col-span-4">
                    <HomePage />
                </div>

                {/* Right Panel - Player 1 */}
                <div className="order-2 sm:order-1 sm:col-span-2">
                    <RightPanal playername={playername[0] || {}} />
                </div>

                <div className="order-3 sm:order-3 sm:col-span-2">
                    <LeftPanal playername={playername[1] || {}} />
                </div> 
            </div>

        </>
    )
}

export default AppPage
