import { atomWithStorage, createJSONStorage } from 'jotai/utils';
// 제안(지성)
const initMember = ({username:'',email:'',grade:'',name:'',nickname:'',phone:'',point_balance:'',role:''});

export const tokenAtom = atomWithStorage("token", null, createJSONStorage(()=>sessionStorage));
export const fcmTokenAtom = atomWithStorage("fcmToken", null, createJSONStorage(()=>sessionStorage));
export const memberAtom = atomWithStorage('member', initMember, createJSONStorage(()=>sessionStorage));