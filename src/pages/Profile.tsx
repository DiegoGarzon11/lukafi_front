import { EditUser, UserIconUpdate } from '@/apis/UserService';
import { EditWallet, GetWalletUser } from '@/apis/WalletService';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ApiResponse } from '@/interfaces/Api';
import { Toast } from '@/hooks/Toast';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '@/interfaces/User';
import { ResponseWallet } from '@/interfaces/Wallet';

const Profile = () => {
	const user: User = JSON.parse(localStorage.getItem('userMain'));
	const [selectedAvatar, setSelectedAvatar] = useState('');
	const [avatarCategory, setAvatarCategory] = useState('adventurer');
	const [dialogAvatar, setDialogAvatar] = useState(false);
	const [responseApi, setresponseApi] = useState<ApiResponse | undefined>(undefined);
	const [visibilytToast, setVisibilityToast] = useState(false);
	const [avatar, setAvatar] = useState('');
	const [tab, setTab] = useState('account');
	const [dataWallet, setDataWallet] = useState<ResponseWallet | undefined>(undefined);
	const [name, setName] = useState(user.name);
	const [lastname, setLastname] = useState(user.last_name);
	const [email, setEmail] = useState(user.email);
	const [valueGoal, setValueGoal] = useState('');
	const [valueCurrency, setValueCurrency] = useState(null);

	const ICONS = {
		adventurer: ['John', 'Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace'],
		avataaars: ['Christopher', 'Sawyer', 'Oliver', 'Ryker', 'Valentina', 'Avery', 'Nolan', 'Liliana'],
		'big-smile': ['Kennedy', 'Kendall', 'Kylo', 'Rey', 'Finn', 'Jake', 'Ben', 'Chewie'],
		micah: ['Valentina', 'Destiny', 'Christopher', 'Brian', 'Adrian', 'Liam', 'Wyatt', 'Ryker'],
		lorelei: ['Christopher', 'Brian', 'Eliza', 'Liliana', 'Nolan', 'Kingston', 'Robert', 'Easton'],
		bottts: ['Ryker', 'Katherine', 'Liliana', 'Brian', 'Jade', 'Easton', 'Ben', 'Chewie'],
	};

	useEffect(() => {
		const fetchData = async () => {
			const response = await GetWalletUser(user.user_id);
			setDataWallet(response);
			setValueGoal(response.wallet.saving.toLocaleString());
			setValueCurrency(response.wallet.currency_type);
		};
		fetchData();
	}, []);

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

	const handleCurrency = (value) => {
		setValueCurrency(value);
	};

	const handleUpdateWallet = async () => {
		setVisibilityToast(false);
		setresponseApi(undefined);

		const response = await EditWallet({
			saving: valueGoal.replace(/,/g, ''),
			currency_type: valueCurrency,
			user_id: user?.user_id,
			wallet_id: dataWallet?.wallet.wallet_id,
		});
		try {
			if (response) {
				setVisibilityToast(true);
				setresponseApi(response);

				await GetWalletUser(user.user_id);
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
		<main className='h-screen pt-16 p-3 '>
			<section className='w-full dark:bg-dark_primary_color bg-light_primary_color rounded-md px-3 md:px-10 pt-5 h-screen md:h-full col-span-3'>
				<div className='dark:text-white text-black flex flex-col items-center justify-between'>
					<div className='flex justify-center items-center gap-2 relative'>
						<div className='flex flex-col items-center justify-center h-autos w-auto '>
							<img
								src={user.icon}
								alt='avatar'
								className='w-28 md:w-32 dark:bg-dark_secondary_color  bg-light_secondary_color  rounded-full mb-1'
							/>

							<p className='text-xl font-bold'>{user.full_name}</p>
							<p className='text-sm opacity-50'>{user.email}</p>
						</div>
						<button
							onClick={() => setDialogAvatar(true)}
							className='dark:bg-dark_secondary_color bg-light_secondary_color text-white  p-2 rounded-full cursor-pointer flex items-center gap-2  absolute  -right-3 bottom-11   border-4 dark:border-dark_primary_color border-light_primary_color '>
							<Pencil1Icon className='w-5 h-5 font-semibold dark:text-white text-black' />
						</button>
					</div>
				</div>
				<div className='flex mt-3 justify-between'>
					<div className='flex flex-col items-center dark:text-white text-black mt-5'>
						<p className='opacity-50'>Usuario desde</p>
						<p className='text-lg font-semibold'>{format(user?.created_in, 'PP')}</p>
					</div>
					{tab === 'wallet' ? (
						<div className='flex flex-col flex-wrap items-center dark:text-white text-black mt-5'>
							<p className=' opacity-50'>Ultima actualizacion:</p>
							<p className=' text-lg font-semibold'>{dataWallet?.wallet?.modify_in && format(dataWallet?.wallet?.modify_in, 'PP - HH:mm')}</p>
						</div>
					) : (
						''
					)}
				</div>
				<Tabs
					defaultValue='account'
					className=''>
					<TabsList className='flex  dark:bg-dark_secondary_color bg-light_secondary_color  w-full mt-5'>
						<TabsTrigger
							className={`${tab === 'account' ? 'bg-alternative_color text-white' : ' '} dark:text-white  cursor-pointer`}
							value='account'
							onClick={() => setTab('account')}>
							Editar perfil
						</TabsTrigger>
						<TabsTrigger
							value='wallet'
							className={`${tab === 'wallet' ? 'bg-alternative_color text-white' : ''} dark:text-white cursor-pointer`}
							onClick={() => setTab('wallet')}>
							Editar Billetera
						</TabsTrigger>
					</TabsList>
					<TabsContent value='account'>
						<div className='flex md:gap-10 gap-3 mt-5 '>
							<div className='flex flex-col w-full'>
								<Label className='text-lg dark:text-white text-black opacity-50'>Nombre</Label>
								<Input
									className='border-b dark:bg-dark_secondary_color bg-light_secondary_color border-none text-lg dark:text-white text-black placeholder:text-gray-300 w-full mt-2 placeholder:opacity-30'
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
									className='border-b dark:bg-dark_secondary_color bg-light_secondary_color border-none text-lg dark:text-white text-black placeholder:text-gray-300 w-full mt-2 placeholder:opacity-30'
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
								className='border-b dark:bg-dark_secondary_color bg-light_secondary_color border-none text-lg dark:text-white text-black placeholder:text-gray-300 w-full mt-2 placeholder:opacity-30'
								id='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder='Email'
								type='email'
							/>
						</div>

						<Button
							onClick={handleUpdateUser}
							disabled={name === '' || lastname === '' || email === ''}
							className=' w-full font-semibold  text-white text-lg flex justify-center items-center py-5 cursor-pointer bg-alternative_color mt-8 '>
							Guardar cambios
						</Button>
						<div className='flex mt-5 justify-around dark:text-white text-black '> 
							<Link to='/auth/change-password' className='hover:underline'>Cambiar contraseña</Link>

							<Link
								to='/auth/delete-account'
								className='hover:underline'
								>
								Eliminar Cuenta
							</Link>
						</div>
					</TabsContent>
					<TabsContent value='wallet'>
						<div className='grid grid-cols-1 grid-rows-1  mt-5 justify-between '>
							<Label className='text-lg dark:text-white text-black opacity-50 text-center'>Tipo de moneda</Label>

							<div className='flex flex-col w-full justify-end items-center'>
								<RadioGroup
									onValueChange={handleCurrency}
									value={valueCurrency}>
									<div className='h-full'>
										<div className='flex gap-3'>
											<div className='flex items-center space-x-2 dark:text-white opacity-80 text-black'>
												<Label
													htmlFor='cop'
													className='text-lg cursor-pointer'>
													Cop
												</Label>
												<RadioGroupItem
													value='cop'
													id='cop'
													className='text-alternative_color cursor-pointer'
												/>
											</div>
											<div className='flex items-center space-x-2 dark:text-white opacity-80 text-black md:ml-5 '>
												<Label
													htmlFor='usd'
													className='text-lg cursor-pointer'>
													Usd
												</Label>
												<RadioGroupItem
													value='usd'
													id='usd'
													className='text-alternative_color cursor-pointer'
												/>
											</div>
										</div>
									</div>
								</RadioGroup>
							</div>
							<div className='flex flex-col w-full mt-3'>
								<Label className='text-lg dark:text-white text-black opacity-50'>Meta a ahorrar</Label>

								<Input
									className='border-b dark:bg-dark_secondary_color border-none text-lg dark:text-white text-black placeholder:text-gray-300 w-full placeholder:opacity-30 '
									id='goal'
									value={valueGoal}
									onChange={handleValueGoal}
									type='text'
								/>
							</div>
						</div>

						<div className='flex flex-col-reverse md:flex-row md:gap-10 mt-8'>
							<Button
								onClick={handleUpdateWallet}
								className=' w-full font-semibold  text-white text-lg flex justify-center items-center py-5 cursor-pointer bg-alternative_color '>
								Guardar cambios
							</Button>
						</div>
					</TabsContent>
				</Tabs>
			</section>

			<Dialog
				open={dialogAvatar}
				onOpenChange={setDialogAvatar}>
				<DialogContent aria-describedby='modal' className=' w-full md:w-[500px] rounded-md dark:bg-dark_primary_color dark:text-white text-black '>
					<div className='flex flex-col items-center space-y-4'>
						<DialogTitle className='text-xl font-semibold'>Selecciona tu avatar</DialogTitle>
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
				<Toast
					visibility={visibilytToast}
					severity={responseApi?.status == 200 ? 'success' : 'error'}
					message={responseApi?.message}
				/>
			)}
		</main>
	);
};

export default Profile;
