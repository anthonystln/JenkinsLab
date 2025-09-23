import './App.css'
import UsersPage from './pages/UsersPage';
import { Toaster } from 'react-hot-toast';

function App() {
	return <>
		<UsersPage />
		<Toaster position="top-right" reverseOrder={false} />
	</>
}

export default App
