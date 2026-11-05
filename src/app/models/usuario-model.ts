export interface Usuario{
    id:number,
    username:string,
    password:string,
    email:string,
    token:string,
    role:Role
}

export type UsuarioActualizar = Pick<Usuario, 'username' | 'email' | 'password'>
export type UsuarioActualizarResponse = Pick<Usuario, 'id' | 'username' | 'email' | 'role'>
export type UsuarioRegistro = Pick<Usuario, 'username' | 'password' | 'email'>
export type UsuarioLogin = Pick<Usuario, 'username' | 'password'>
export type UsuarioRegistroLoginResponse = Pick<Usuario, 'id' | 'username' | 'email' | 'token' | 'role'>
export type Role = 'USER' | 'ADMIN'