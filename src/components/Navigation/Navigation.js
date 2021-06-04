import React from 'react';

const Navigation = ({onRouteChange, isSignedIn}) => {
	if(isSignedIn){
		return (
			<nav style={{display: 'flex', justifyContent: 'flex-end'}}>
				<p 
				 onClick={() => {
				 	onRouteChange('signout')
				 }} 
				 className='f3 link dim black underline pa3 pointer'
	            >Sign Out</p>
				{/*we cannot do onRouteChange('home') as it will be called and executed, but we want it to be called
	                  whenever onChange happens. So we wrap it in an arrow function*/}

			</nav>
		);
	} else {
		return (
			<nav style={{display: 'flex', justifyContent: 'flex-end'}}>
				<p 
				 onClick={() => onRouteChange('signin')} 
				 className='f3 link dim black underline pa3 pointer'
	            >Sign In</p>
	            <p 
				 onClick={() => onRouteChange('register')} 
				 className='f3 link dim black underline pa3 pointer'
	            >Register</p>
			</nav>
		);
	}
}

export default Navigation;