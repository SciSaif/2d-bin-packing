import { ClipLoader } from 'react-spinners'
import { useAppSelector } from '../../../redux/hooks';

const Loading = () => {
    const { packingProgress } = useAppSelector((state) => state.main);
    const progressPercentage = Math.ceil(packingProgress * 100);

    return (
        <div className="flex flex-col items-center justify-center py-10 text-green-900 gap-y-2">
            <ClipLoader color="#134e4a" size={50} />
            <p className="text-2xl font-semibold">
                Packing your images {progressPercentage === 0 ? "" : `${progressPercentage}%`}
            </p>
        </div>
    )
}

export default Loading