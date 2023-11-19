// Components
import Form from "./subcomponents/Form";

export default function ShufflePage() {
	return (
		<div
			className={
				"flex flex-col items-center justify-center w-full pt-[calc(var(--header-height)+5rem)] pb-36 lg:min-h-screen gap-[2.6rem]"
			}
		>
			<Form />
		</div>
	);
}
