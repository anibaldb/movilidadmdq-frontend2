export interface Usuario{
    id:number,
    username:string,
    password:string,
    email:string,
    token:string,
    role:Role,
    bloqueado?: boolean
    proveedor?: Proveedor
}

export type Proveedor = 'LOCAL' | 'GOOGLE'
export type UsuarioActualizar = Pick<Usuario, 'username' | 'email' | 'password'>
export type UsuarioActualizarResponse = Pick<Usuario, 'id' | 'username' | 'email' | 'role' | 'bloqueado'>
export type UsuarioRegistro = Pick<Usuario, 'username' | 'password' | 'email'>
export type UsuarioLogin = Pick<Usuario, 'username' | 'password'>
export type UsuarioAuth = Pick<Usuario, 'id' | 'username' | 'email' | 'token' | 'role' | 'proveedor'>
export type Role = 'USER' | 'ADMIN'