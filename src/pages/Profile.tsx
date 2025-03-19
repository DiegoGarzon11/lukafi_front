import {EditUser, UserIconUpdate} from '@/apis/UserService';
import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogDescription, DialogHeader} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {ApiResponse} from '@/interfaces/Api';
import {Toast} from '@/tools/Toast';
import {Pencil1Icon} from '@radix-ui/react-icons';
import {format} from 'date-fns';
import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {GetWalletUser} from '@/apis/WalletService';
import {User} from '@/interfaces/User';
import {ResponseWallet} from '@/interfaces/Wallet';

const Profile = () => {
	const user: User = JSON.parse(localStorage.getItem('userMain'));
	const ICONS = {
		adventurer: ['John', 'Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace'],
		avataaars: ['Christopher', 'Sawyer', 'Oliver', 'Ryker', 'Valentina', 'Avery', 'Nolan', 'Liliana'],
		'big-smile': ['Kennedy', 'Kendall', 'Kylo', 'Rey', 'Finn', 'Jake', 'Ben', 'Chewie'],
		micah: ['Valentina', 'Destiny', 'Christopher', 'Brian', 'Adrian', 'Liam', 'Wyatt', 'Ryker'],
		lorelei: ['Christopher', 'Brian', 'Eliza', 'Liliana', 'Nolan', 'Kingston', 'Robert', 'Easton'],
		bottts: ['Ryker', 'Katherine', 'Liliana', 'Brian', 'Jade', 'Easton', 'Ben', 'Chewie'],
	};

	const [selectedAvatar, setSelectedAvatar] = useState('');
	const [avatarCategory, setAvatarCategory] = useState('adventurer');
	const [dialogAvatar, setDialogAvatar] = useState(false);
	const [responseApi, setresponseApi] = useState<ApiResponse | undefined>(undefined);
	const [visibilytToast, setVisibilityToast] = useState(false);
	const [avatar, setAvatar] = useState('');
	const [tab, setTab] = useState('account');
	const [name, setName] = useState(user.name);
	const [lastname, setLastname] = useState(user.last_name);
	const [email, setEmail] = useState(user.email);
	const [valueSalary, setValueSalary] = useState('0');
	const [valueGoal, setValueGoal] = useState('0');
	const [dataWallet, setDataWallet] = useState<ResponseWallet | undefined>(undefined);
	const navigate = useNavigate();

	const handleUpdateIcon = async () => {
		setVisibilityToast(false);
		const response = await UserIconUpdate({
			icon: avatar,
			user_id: user.user_id,
		});
		if (response) {
			user.icon = avatar;
			localStorage.setItem('userMain', JSON.stringify(user));
			setresponseApi(response);
			setVisibilityToast(true);

			setDialogAvatar(false);
			navigate('/profile');
		}
	};

	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		const response = await GetWalletUser(user.user_id);
	// 		setDataWallet(response.wallet);
	// 		console.log(dataWallet);
	// 	};
	// 	fetchData();
	// }, []);

	const handleValueSalary = (e) => {
		let value = e.target.value.replace(/[^0-9.]/g, '');
		const floatValue = parseFloat(value);
		const formattedValue = floatValue.toLocaleString();

		setValueSalary(formattedValue === 'NaN' ? '0' : formattedValue);
	};
	const handleValueGoal = (e) => {
		let value = e.target.value.replace(/[^0-9.]/g, '');
		const floatValue = parseFloat(value);
		const formattedValue = floatValue.toLocaleString();

		setValueGoal(formattedValue === 'NaN' ? '0' : formattedValue);
	};

	const handleUpdateUser = async () => {
		setVisibilityToast(false);
		setresponseApi(undefined);
		const response = await EditUser({
			name: name,
			lastName: lastname,
			email: email,
			user: user.user_id,
		});
		try {
			if (response) {
				setVisibilityToast(true);
				setresponseApi(response);
				user.full_name = `${name} ${lastname}`;
				user.last_name = lastname;
				user.email = email;
				localStorage.setItem('userMain', JSON.stringify(user));

				setDialogAvatar(false);
				navigate('/profile');
			}
		} catch (error) {
			console.error(error);
		} finally {
			setVisibilityToast(true);
			setresponseApi(response);
		}
	};

	return (
		<main className='h-full pt-20 p-3 '>
			<section className='w-full  dark:bg-dark_primary_color rounded-md px-3 md:px-10 pt-5 pb-6  h-full col-span-3'>
				<div className='dark:text-white text-black flex flex-col items-center justify-center'>
					<div className='flex justify-center items-center gap-3'>
						<div className='flex flex-col items-start justify-center  '>
							<img src={user.icon} alt='avatar' className='w-28 h-28 rounded-full' />
							<div className='mt-5'>
								<p className='text-xl font-bold'>{user.full_name}</p>
								<p className='text-sm opacity-50'>{user.email}</p>
							</div>
						</div>
						<button
							onClick={() => setDialogAvatar(true)}
							className='bg-alternative_color text-white  p-2 rounded-full cursor-pointer flex items-center gap-2 absolute right-34 md:relative md:right-14'>
							<Pencil1Icon className='w-5 h-5 font-semibold' />
						</button>
					</div>
				</div>
				<div className='flex justify-between'>
					<div className='flex flex-col items-center dark:text-white text-black mt-5'>
						<p className='opacity-50'>Usuario desde</p>
						<p className='text-lg font-semibold'>{format(user?.created_in, 'PP')}</p>
					</div>
					<div className='flex flex-col items-center dark:text-white text-black mt-5'>
						<p className='opacity-50'>Ultima actualización</p>
						{/* <p className='text-lg font-semibold'>{format(dataWallet?.modify_in, 'PP')}</p> */}
					</div>
				</div>
				<Tabs defaultValue='account' className=''>
					<TabsList className='flex  bg-dark_secondary_color w-full mt-5'>
						<TabsTrigger
							className={`${
								tab === 'account' ? 'bg-alternative_color' : ' dark:bg-dark_foreground'
							} dark:text-white text-black cursor-pointer`}
							value='account'
							onClick={() => setTab('account')}>
							Editar perfil
						</TabsTrigger>
						<TabsTrigger
							value='password'
							className={`${
								tab === 'wallet' ? 'bg-alternative_color' : ' dark:bg-dark_foreground'
							} dark:text-white text-black cursor-pointer`}
							onClick={() => setTab('wallet')}>
							Editar Billetera
						</TabsTrigger>
					</TabsList>
					<TabsContent value='account'>
						<div className='flex md:gap-10 gap-3 mt-5 '>
							<div className='flex flex-col w-full'>
								<Label className='text-lg dark:text-white text-black opacity-50'>Nombre</Label>
								<Input
									className='border-b dark:bg-dark_secondary_color border-none text-lg dark:text-white text-black placeholder:text-gray-300 w-full mt-2 placeholder:opacity-30'
									id='name'
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder='Nombre'
									type='text'
								/>
							</div>
							<div className='flex flex-col  w-full'>
								<Label className='text-lg dark:text-white text-black opacity-50'>Apellido</Label>
								<Input
									className='border-b dark:bg-dark_secondary_color border-none text-lg dark:text-white text-black placeholder:text-gray-300 w-full mt-2 placeholder:opacity-30'
									id='lastname'
									value={lastname}
									onChange={(e) => setLastname(e.target.value)}
									placeholder='Apellido'
									type='text'
								/>
							</div>
						</div>
						<div className='flex flex-col mt-5'>
							<Label className='text-lg dark:text-white text-black opacity-50'>Correo electrónico</Label>
							<Input
								className='border-b dark:bg-dark_secondary_color border-none text-lg  dark:text-white text-black placeholder:text-gray-300 w-full  placeholder:opacity-30'
								id='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder='Email'
								type='email'
							/>
						</div>

						<div className='flex flex-col-reverse md:flex-row md:gap-10 mt-8'>
							<div className='w-full flex flex-col gap-5 mt-8 md:mt-0'>
								<Button>
									<Link
										to='/auth/change-password'
										className=' w-full font-semibold  text-white text-lg flex justify-center items-center py-1 rounded-lg cursor-pointer border border-alternative_color '>
										Cambiar contraseña
									</Link>
								</Button>

								<Link to='/auth/delete-account' className='dark:text-white text-black underline self-center '>
									Eliminar Cuenta
								</Link>
							</div>
							<Button
								onClick={handleUpdateUser}
								disabled={name === '' || lastname === '' || email === ''}
								className=' w-full font-semibold  text-white text-lg flex justify-center items-center py-5 cursor-pointer bg-alternative_color '>
								Guardar cambios
							</Button>
						</div>
					</TabsContent>
					<TabsContent value='password'>
						<div className='flex itmes-center md:gap-10 gap-3 mt-5 '>
							<div className='flex flex-col w-full'>
								<Label className='text-lg dark:text-white text-black opacity-50'>Salario</Label>
								<Input
									className='border-b dark:bg-dark_secondary_color border-none text-lg dark:text-white text-black placeholder:text-gray-300 w-full mt-2 placeholder:opacity-30'
									id='name'
									value={valueSalary}
									onChange={handleValueSalary}
									type='text'
								/>
							</div>
							<div className='flex flex-col w-full'>
								<Label className='text-lg dark:text-white text-black opacity-50'>Meta a ahorrar</Label>
								<Input
									className='border-b dark:bg-dark_secondary_color border-none text-lg dark:text-white text-black placeholder:text-gray-300 w-full placeholder:opacity-30 mt-2'
									id='goal'
									value={valueGoal}
									onChange={handleValueGoal}
									type='text'
								/>
							</div>
						</div>
						<div className='flex w-full items-center mt-5'>
							<h2 className='text-lg dark:text-white text-black opacity-50 mr-28'>Tipo de moneda</h2>
							<RadioGroup className='flex '>
								<div className='flex items-center space-x-2 dark:text-white opacity-80 text-black'>
									<Label htmlFor='r1'>Cop</Label>
									<RadioGroupItem value='cop' id='cop' className='text-alternative_color' />
								</div>
								<div className='flex items-center space-x-2 dark:text-white opacity-80 text-black'>
									<Label htmlFor='r2'>Usd</Label>
									<RadioGroupItem value='usd' id='usd' className='text-alternative_color' />
								</div>
							</RadioGroup>
						</div>

						<div className='flex flex-col-reverse md:flex-row md:gap-10 mt-8'>
							<Button
								onClick={handleUpdateUser}
								disabled={name === '' || lastname === '' || email === ''}
								className=' w-full font-semibold  text-white text-lg flex justify-center items-center py-5 cursor-pointer bg-alternative_color '>
								Guardar cambios
							</Button>
						</div>
					</TabsContent>
				</Tabs>
			</section>

			<Dialog open={dialogAvatar} onOpenChange={setDialogAvatar}>
				<DialogContent className=' w-full md:w-[500px] rounded-md dark:bg-dark_primary_color dark:text-white text-black '>
					<div className='flex flex-col items-center space-y-4'>
						<h2 className='text-xl font-semibold'>Selecciona tu avatar</h2>
						<DialogHeader>
							<div className='flex gap-3 w-full justify-center flex-wrap'>
								<Button
									onClick={() => setAvatarCategory('adventurer')}
									className={`${avatarCategory === 'adventurer' ? 'bg-alternative_color' : ''} w-32 cursor-pointer `}>
									Adventurer
								</Button>
								<Button
									onClick={() => setAvatarCategory('avataaars')}
									className={`${avatarCategory === 'avataaars' ? 'bg-alternative_color' : ''} w-32 cursor-pointer `}>
									Avatar
								</Button>
								<Button
									onClick={() => setAvatarCategory('big-smile')}
									className={`${avatarCategory === 'big-smile' ? 'bg-alternative_color' : ''} w-32 cursor-pointer `}>
									Big Face
								</Button>
								<Button
									onClick={() => setAvatarCategory('micah')}
									className={`${avatarCategory === 'micah' ? 'bg-alternative_color' : ''} w-32 cursor-pointer `}>
									Book
								</Button>
								<Button
									onClick={() => setAvatarCategory('lorelei')}
									className={`${avatarCategory === 'lorelei' ? 'bg-alternative_color' : ''} w-32 cursor-pointer `}>
									Movie
								</Button>
								<Button
									onClick={() => setAvatarCategory('bottts')}
									className={`${avatarCategory === 'bottts' ? 'bg-alternative_color' : ''} w-32 cursor-pointer `}>
									Robot
								</Button>
							</div>
						</DialogHeader>

						<DialogDescription className='grid grid-cols-4 gap-4'>
							{ICONS[avatarCategory]?.map((seed) => (
								<img
									key={seed}
									src={`https://api.dicebear.com/9.x/${avatarCategory}/svg?seed=${seed}`}
									alt={seed}
									className={`w-20 h-20 cursor-pointer border-2 rounded-lg ${
										selectedAvatar === seed ? 'border-alternative_color' : 'border-transparent'
									}`}
									onClick={() => {
										setSelectedAvatar(seed);
										setAvatar(`https://api.dicebear.com/9.x/${avatarCategory}/svg?seed=${seed}`);
									}}
								/>
							))}
						</DialogDescription>
						{selectedAvatar && (
							<p className='mt-4 text-lg'>
								Seleccionaste: <b className='text-main_color'>{selectedAvatar}</b>
							</p>
						)}
						<Button
							onClick={handleUpdateIcon}
							className=' w-full font-semibold  text-white text-lg flex justify-center items-center py-5 cursor-pointer bg-alternative_color '>
							Guardar cambios
						</Button>
					</div>
				</DialogContent>
			</Dialog>
			{visibilytToast && (
				<Toast visibility={visibilytToast} severity={responseApi?.status == 200 ? 'success' : 'error'} message={responseApi?.message} />
			)}
		</main>
	);
};

export default Profile;
