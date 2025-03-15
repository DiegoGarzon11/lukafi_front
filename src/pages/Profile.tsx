import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserIconUpdate } from '@/apis/UserService';
import { Toast } from '@/tools/Toast';
import { ApiResponse } from '@/interfaces/Api';
import { useNavigate } from 'react-router-dom';
const Profile = () => {
	const user = JSON.parse(localStorage.getItem('userMain'));
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
	const navigate = useNavigate();
	const handleUpdateIcon = async (e) => {
		setVisibilityToast(false);
		const response = await UserIconUpdate({
			icon: avatar,
			user_id: user.user_id,
		});
		if (response) {
			const user = JSON.parse(localStorage.getItem('userMain'));
			user.icon = avatar;
			localStorage.setItem('userMain', JSON.stringify(user));
			setresponseApi(response);
			setVisibilityToast(true);
			setAvatarCategory(e.target.value);

			setDialogAvatar(false);
			navigate('/profile');
		}
	};

	return (
		<div className='h-full pt-20 p-3 gap-3 dark:bg-black bg-white'>
			<main className='flex   flex-col justify-center items-center gap-5 w-full pt-40'>
				<section className='flex gap-3 w-1/2   items-center justify-start'>
					<div>
						<img
							src={user.icon}
							alt='avatar'
							className='w-28 h-28 rounded-full'
						/>
						<p className='text-xl font-bold'>{user.full_name}</p>
						<p className='text-sm'>{user.email}</p>
					</div>
					<div>
						<button
							onClick={() => setDialogAvatar(true)}
							className='bg-alternative_color text-white p-2 rounded-xl'>
							Selecionar Avatar
						</button>
					</div>
				</section>
				<section className='flex gap-20 items-center justify-between  w-1/2  '>
					<div className='w-full'>
						<label
							htmlFor='name'
							className='text-lg font-semibold'>
							Name
						</label>
						<input
							type='text'
							id='name'
							autoComplete='name'
							className='w-full rounded-md p-2 border-gray-600/50 dark:bg-primary-foreground dark:text-white dark:border-zinc-700 border-solid border outline-hidden text-black'
						/>
					</div>
					<div className='w-full'>
						<label
							htmlFor='lastname'
							className='text-lg font-semibold'>
							Apellido
						</label>
						<input
							type='text'
							id='lastname'
							className='w-full rounded-md p-2 border-gray-600/50 dark:bg-primary-foreground dark:text-white dark:border-zinc-700 border-solid border outline-hidden text-black'
						/>
					</div>
				</section>
				<section className='flex gap-20 items-end justify-between  w-1/2  '>
					<div className='w-full'>
						<label
							htmlFor='name'
							className='text-lg font-semibold'>
							Email
						</label>
						<input
							type='text'
							id='name'
							autoComplete='name'
							className='w-full rounded-md p-2 border-gray-600/50 dark:bg-primary-foreground dark:text-white dark:border-zinc-700 border-solid border outline-hidden text-black'
						/>
					</div>
					<div className=' w-full '>
						<button className='bg-green-500 rounded-md py-2  w-full'>Guardar cambios</button>
					</div>
				</section>

				<div className='flex gap-20 items-center justify-center  w-1/2  '>
					<Link
						to='/auth/change-password'
						className=' w-full'>
						Cambiar contraseña
					</Link>
					<Link
						to='delete-account'
						className='w-full'>
						Eliminar cuenta
					</Link>
				</div>
			</main>
			<Dialog
				open={dialogAvatar}
				onOpenChange={setDialogAvatar}>
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
								Seleccionaste: <b className='text-lime-500'>{selectedAvatar}</b>
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
		</div>
	);
};

export default Profile;
