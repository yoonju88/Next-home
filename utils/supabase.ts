
import { createClient } from '@supabase/supabase-js'

const bucket = 'Temp-home-away'
const url = process.env.SUPABASE_URL as string
const key = process.env.SUPABASE_KEY as string

export const supabase = createClient(url, key)

//  이미지 파일을 Supabase 스토리지에 업로드하고, 업로드된 이미지의 공개 URL을 반환하는 함수
export const uploadImage = async (image: File) => {
    const timestamp = Date.now()
    const newName = `${timestamp}-${image.name}`

    const { data } = await supabase.storage
        .from(bucket) // 버킷은 파일을 저장하는 공간
        .upload(newName, image, { cacheControl: '3500', }) //캐싱 주기가 ‘3500초’로 설정
    if (!data) throw new Error('Image upload failed')
    return supabase.storage.from(bucket).getPublicUrl(newName).data.publicUrl;
}
console.log(uploadImage)

/* 이미지 업로드가 성공하면, 다시 supabase.storage.from(bucket)*/
/* .getPublicUrl(newName)을 사용하여 해당 이미지 파일의 공개 URL을 가져옵니다.*/
/* data.publicUrl은 해당 URL을 반환합니다. 이 URL은 사용자가 업로드한 이미지를 공개적으로 접근할 수 있는 주소*/