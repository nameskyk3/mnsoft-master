package com.hyundai.mnsoft;

import com.mobigen.framework.security.SessionManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import springfox.documentation.annotations.ApiIgnore;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Slf4j
@Controller
@RequestMapping(value = {"/"})
@ApiIgnore
public class ViewController {
    @Autowired
    SessionManager manager;

    @RequestMapping(value = {"/", "main.html"}, method = RequestMethod.GET)
    public String viewIndex(HttpServletRequest request, HttpServletResponse response) {
        //manager.logout(request, response);
//        UserModel user = manager.getUser();
//        if (null == user) {
//            return "index";
//        }

        return "main";
    }

//    @RequestMapping(value = {"/test.html"}, method = RequestMethod.GET)
//    public String fileuptest(HttpServletRequest request, HttpServletResponse response) {
//        UserModel user = manager.getUser();
//        if (null == user) {
//            return "index";
//        }
//
//        return "test";
//    }
//
//    @RequestMapping(
//            value = {"/tcore", "/inventory", "/job", "/dashboard/*", "/analysis", "/setting/**", "/admin", "/help", "/analysis/*"},
//            headers = "Accept=text/html",
//            method = RequestMethod.GET)
//    public String viewTcore(HttpServletRequest request, HttpServletResponse response) throws Exception {
//
//        String uri = request.getRequestURI();
//
//        if (!uri.equals("/tcore")) {
//            String defaultPage = "/inventory";
//            boolean authFlag = false;
//            // TODO - 권한 체크
//            UserModel userModel = manager.getUser();
//            if (userModel != null) {
//                if (userModel.getAuthFlag() != null && !userModel.getAuthFlag().equals("SUPER-ADMIN")) {
//                    List<AuthUis> authUiList = userModel.getUserAuth().getAuthMenu().getAuthUis();
//                    if (authUiList != null && authUiList.size() > 0) {
//                        for (int i = 0; i < authUiList.size(); i++) {
//                            if (authUiList.get(i).getPath() != null && authUiList.get(i).getPath().equals(uri)) {
//                                if (authUiList.get(i).getReadAuth() == 1) {
//                                    authFlag = true;
//                                    break;
//                                }
//                            }
//                        }
//                    } else {
//                        authFlag = false;
//                    }
//                } else {
//                    authFlag = true;
//                }
//            }
//            if (authFlag == false) {
//                response.sendRedirect(defaultPage);
//            }
//        }
//
//        return "tcore";
//    }
}