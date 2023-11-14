export default async function AuthLayout(props: {
	children: React.ReactNode;
	auth: React.ReactNode;
}) {
	return (
		<>
			{props.children}
			{props.auth}
		</>
	);
}
