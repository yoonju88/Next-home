// **img.clerk.com**에서 HTTPS 프로토콜을 사용하여 이미지를 가져올 수 있게 허용하고
//  Next.js의 이미지 최적화 기능을 통해 해당 이미지를 성능이 더 좋게 제공할 수 있습니다.

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img.clerk.com',
            },
            {
                protocol: 'https',
                hostname: 'ksfhpbeanxnlfmdlhfgo.supabase.co',
            },
        ],
    },
    env: {
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY, // 환경 변수 추가
        API_BASE_URL: process.env.API_BASE_URL, // 환경 변수 추가
    },
};
export default nextConfig;

// images 설정을 통해 외부 이미지 사용을 관리하는 옵션을 설정할 수 있습니다. 
//Next.js는 기본적으로 외부 이미지를 직접 허용하지 않으므로
// 외부 호스트에서 이미지를 로드할 수 있도록 허용하려면 이러한 설정이 필요합니다.

//**remotePatterns**는 Next.js에서 외부 이미지 호스트를 정의하는 데 사용하는 새로운 옵션
//protocol: 'https': 이미지를 로드할 때 HTTPS 프로토콜만 허용하도록 설정합니다. 이는 보안 연결을 유지하는 데 필수적
// hostname: 'img.clerk.com': 이미지를 로드할 수 있는 호스트 이름을 정의합니다. 
//            **img.clerk.com**에서 제공하는 이미지만 로드할 수 있도록 허용합니다.
// Next.js에서 외부 이미지 최적화 기능을 사용할 수 있도록 설정하는 것입니다. 
