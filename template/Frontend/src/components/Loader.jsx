import { useTheme } from '../contexts/ThemeContext';
import { BarLoader } from 'react-spinners';

const SpinningLoader = ({ size = 10 }) => {
    const { isDark } = useTheme()
    return (
        <div className={`flex flex-col justify-center items-center gap-4 h-full w-full ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            <img
                src={'/load.webp'}
                alt="Loading..."
                style={{ width: "auto", height: size }}
                className="animate-pulse"
            />
            <BarLoader color={isDark ? 'white' : "black"} width={200} className='w-full' />
        </div>
    );
};

export default SpinningLoader;
