/**
 * Hook logout data.
 * 
 * @typedef useLogOut
 * @kind hook
 * 
 * @returns {object}
 */

const useLogOut = () => {
    const logout = () =>{
      sessionStorage.removeItem('userInfos');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
      window.location.href = "/";
    }

    return { logout }
}

export default useLogOut;