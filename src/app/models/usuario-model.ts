export interface Usuario{
    id:number,
    username:string,
    password:string,
    email:string,
    token:string,
    rol:Rol
}

export type UsuarioActualizar = Pick<Usuario, 'username' | 'email' | 'password'>
export type UsuarioActualizarResponse = Pick<Usuario, 'id' | 'username' | 'email' | 'rol'>
export type UsuarioRegistro = Pick<Usuario, 'username' | 'password' | 'email'>
export type UsuarioLogin = Pick<Usuario, 'username' | 'password'>
export type UsuarioRegistroLoginResponse = Pick<Usuario, 'id' | 'username' | 'email' | 'token' | 'rol'>
export type Rol = 'USER' | 'ADMIN'