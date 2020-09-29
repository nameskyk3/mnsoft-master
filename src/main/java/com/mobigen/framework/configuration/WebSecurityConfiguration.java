package com.mobigen.framework.configuration;

import com.mobigen.framework.security.CustomAuthenticationProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {
    @Autowired
    private CustomAuthenticationProvider customAuthenticationProvider;

	@Override
	protected void configure(AuthenticationManagerBuilder auth) {
		auth.authenticationProvider(customAuthenticationProvider);
	}

	@Override
	public void configure(WebSecurity webSecurity) {
		webSecurity.ignoring().antMatchers("/logo/**", "/js/**", "/css/**", "/image/**", "/img/**", "/fonts/**", "/message/**", "/constant/**", "/common/notify/*");
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http
			.authorizeRequests()
//				.antMatchers("/user/login", "/user/validateToken", "/currentAlarm/msg", "/", "/users/userfind", "/users/register", "/common/getApplicationProperty").permitAll()
				// analysis/metric 테스트를 위해 추가 나중에 혹시라도 제거 안되있으면 제거해주세요 2019-10-07
				.antMatchers("**", "test.html", "test.html", "/service/file/fileUpload.do","/user/login", "/user/validateToken", "/currentAlarm/msg", "/", "/users/userDuplicateCheck", "/users/register", "/common/getApplicationProperty", "/user/getRsaKey").permitAll()
				.anyRequest().authenticated()
				.and()
			.sessionManagement()
				.invalidSessionUrl("/")
				.and()
			.logout()
				.logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
				.invalidateHttpSession(true)
				.deleteCookies("mobigen-session-id")
				.logoutSuccessUrl("/")
				.and()
			.csrf().disable();
	}
}
