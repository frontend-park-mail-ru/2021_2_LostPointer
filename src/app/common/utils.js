import Request from '../../framework/appApi/request.js';

const logout = () => Request.post('/user/logout');

export { logout };
