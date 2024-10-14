import SubmitButtons from '@/components/form/Buttons'
import FormContainer from '@/components/form/FormContainer'
import FormInput from '@/components/form/FormInput'

const createProfileAction = async (preState:any, formData:FormData) => {
    'use server'
    const firstName= formData.get('firstName') as string
    return {message: 'Profile created'}

}


export default function CreateProfilePage() {
    return (
        <section>
            <h1 className='text-2xl font-semibold mb-8 capitalize'>New user</h1>
            <div className='border p-8 rounded-md'>
               <FormContainer action={createProfileAction}>
                    <div className='grid md:grid-cols-2 gap-4 mt-4' >
                        <FormInput type='text' name='fistName' label="First Name"/>
                        <FormInput type='text' name='lastName' label="Last Name"/>
                        <FormInput type='text' name='userName' label="Username"/>
                    </div>
                    <SubmitButtons text="Create Profile" className='mt-8'/>
               </FormContainer>
            </div>
        </section>
    )
}