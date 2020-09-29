package com.mobigen.framework.security;

import org.springframework.security.access.expression.SecurityExpressionRoot;
import org.springframework.security.access.expression.method.MethodSecurityExpressionOperations;
import org.springframework.security.core.Authentication;

import java.util.Arrays;
import java.util.List;

public class CustomMethodSecurityExpressionRoot extends SecurityExpressionRoot implements MethodSecurityExpressionOperations {

    private Object filterObject;
    private Object returnObject;

    public CustomMethodSecurityExpressionRoot(Authentication authentication) {
        super(authentication);
    }

    // @PreAuthorize("hasMenuAuth(1, 4310)")
    public boolean hasMenuAuth(int readOrWrite, List<Integer> accessibleMenuIds) {
//        boolean resultVal = true;
//        final UserModel user = ((UserModel) this.getPrincipal());
//        if("SUPER-ADMIN".equals(user.getRoleId())){
//            return true;
//        }
//        UserAuth userAuth = user.getUserAuth();
//        AuthMenu authMenu = userAuth.getAuthMenu();
//        List<AuthUis> authUis = authMenu.getAuthUis();
//        if(readOrWrite == 0) {
//            resultVal = authUis.stream().anyMatch(ui -> accessibleMenuIds.contains(ui.getMenuId()) && ui.getReadAuth() == 1);
//        }else {
//            resultVal = authUis.stream().anyMatch(ui -> accessibleMenuIds.contains(ui.getMenuId()) && ui.getWriteAuth() == 1);
//        }
//        //System.out.println(resultVal);
//        return resultVal;
        return true;
    }

    @Override
    public Object getFilterObject() {
        return this.filterObject;
    }

    @Override
    public Object getReturnObject() {
        return this.returnObject;
    }

    @Override
    public Object getThis() {
        return this;
    }

    @Override
    public void setFilterObject(Object obj) {
        this.filterObject = obj;
    }

    @Override
    public void setReturnObject(Object obj) {
        this.returnObject = obj;
    }
}