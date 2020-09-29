package com.mobigen.framework.security;

import com.hyundai.mnsoft.user.model.UserModel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Slf4j
@Component
public class SessionManager {
	@Autowired
	CustomAuthenticationProvider customAuthenticationProvider;

	@Autowired
	private SecurityContextRepository repository;

	/**
	 * 사용자 인증을 진행. 사용자 인증이 성공하면 Spring-Security에 정보를 생성 함
	 *
	 * @param request
	 * @param response
	 * @param user
	 * @return
	 * @throws Exception
	 */
	public IUserModel auth(HttpServletRequest request, HttpServletResponse response, IUserModel user, IUserDao userDao) throws Exception {

		// 로그인 해서 사용자의 데이터를 가져오는 부분
		//IUserModel user = userDao.getUser(userModel);

		if (user == null) {
			throw new Exception("User Auth Fail");
		}

		// 사용자 인증이 성공 하면 Spring-Security에 현재 session-id를 등록
		String sessionKey = request.getSession().getId();

		// 사용자 Token 생성
		UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(user.getUsername(), sessionKey);
		customAuthenticationProvider.setUser(user);
		customAuthenticationProvider.setUserRole(user.getUserRole());

		Authentication auth = customAuthenticationProvider.authenticate(token);
		if (auth == null) {
			throw new Exception("Make Authentication Fail");
		}

		SecurityContextHolder.getContext().setAuthentication(auth);
		repository.saveContext(SecurityContextHolder.getContext(), request, response);


		return user;
	}

	/**
	 * 현재 세션에 대한 사용자 계정을 반환
	 *
	 * @return
	 */
	public String getUsername() {
		String name = "";

		try {
			if(!(SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof String)) {
				UserDetails user = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getDetails();
				name = user.getUsername();
			}

		} catch (Exception e) {
			log.error("Error: GetCustomerName", e);
		}

		return name;
	}

	public UserModel getUser() {
		UserModel user = null;

		try {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			if (authentication != null && !authentication.getPrincipal().equals("anonymousUser")){
				user = (UserModel)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
			}
		} catch (Exception e) {
			log.error("Error: GetCustomer", e);
		}

		return user;
	}

	public void logout(HttpServletRequest request, HttpServletResponse response) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null){
            if (authentication.getPrincipal().equals("anonymousUser")) {
                return;
            }

            new SecurityContextLogoutHandler().logout(request, response, authentication);
        }
    }
}
