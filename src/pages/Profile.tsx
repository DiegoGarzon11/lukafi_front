import { Link } from 'react-router-dom';

const Profile = () => {
	const user = JSON.parse(localStorage.getItem('userMain'));
	return (
		<div className='h-full pt-20 p-3 gap-3 dark:bg-black bg-white'>
			<main className='flex   flex-col justify-center items-center gap-5 w-full pt-40'>
				<section className='flex gap-3 w-1/2   items-center justify-start'>
					<img
						src='src/assets/avatar/dog.webp'
						alt='avatar'
						className='w-24 h-w-24 rounded-full'
					/>
					<div>
						<p className='text-xl font-bold'>{user.full_name}</p>
						<p className='text-sm'>{user.email}</p>
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
							className='w-full rounded-md p-2 border-gray-600/50 dark:bg-primary-foreground dark:text-white dark:border-zinc-700 border-solid border outline-none text-black'
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
							className='w-full rounded-md p-2 border-gray-600/50 dark:bg-primary-foreground dark:text-white dark:border-zinc-700 border-solid border outline-none text-black'
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
							className='w-full rounded-md p-2 border-gray-600/50 dark:bg-primary-foreground dark:text-white dark:border-zinc-700 border-solid border outline-none text-black'
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
		</div>
	);
};

export default Profile;
