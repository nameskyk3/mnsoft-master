package com.hyundai.mnsoft.user.model;

import com.mobigen.framework.security.IUserModel;
import lombok.Data;
import org.apache.ibatis.type.Alias;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.HashMap;

@Data
@Alias("UserModel")
@SuppressWarnings("serial")
public class UserModel implements IUserModel {

	private String userId;
	//@Length(min=2, max=64)
	private String name;
	private String loginId;
	//@Length(min=4, max=64)
	private String password;

	private String roleId;
	private String userRole;

	private String phone;
	private String email;
	private String department;
	private String useExpire;
	private String expireDate;
	private String status;

	private int approved;
	private String approvedName;
	private String createAt;
	private String lastUpdateAt;
	private String lastLoginAt ;

	private String authFlag;
	private HashMap tangoUserInfo;

    public void setUsername(String value) {
    	name = value;
    }

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return null;
	}

	@Override
	public String getUsername() {
		return loginId;
	}

	@Override
	public boolean isAccountNonExpired() {
		return false;
	}

	@Override
	public boolean isAccountNonLocked() {
		return false;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return false;
	}

	@Override
	public boolean isEnabled() {
		return false;
	}

	public String getUserRole() {
		return roleId;
	}
	public void setUserRole(String value) {
		roleId = value;
	}

	// Tango 사용자 정보 맵핑
	public void setTangoUserInfo(HashMap map) {
		tangoUserInfo = map;

//		userId = "1";
		name = (String) map.get("userNm");
		loginId = (String) map.get("userId");
//		phone = (String) map.get("celpTlno");
//		email = (String) map.get("emailAddr");
//		department = (String) map.get("orgNm");
//		lastUpdateAt = (String) map.get("lastPwdChgDate");
	}
}
