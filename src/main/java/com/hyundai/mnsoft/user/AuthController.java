package com.hyundai.mnsoft.user;

import com.mobigen.framework.component.Messages;
import com.mobigen.framework.result.JsonResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;

@Slf4j
@Controller
@RequestMapping(value = "/user")
public class AuthController {

	@Autowired
	private Messages message;

	@RequestMapping(value = "/login", method = RequestMethod.POST)
	@ResponseBody
	public JsonResult login(@RequestBody HashMap param, HttpServletRequest request, HttpServletResponse response) throws Exception {
		JsonResult js = new JsonResult();
		try {
			//로그인 로직

		}catch (Exception e){
			log.error(e.toString());
			js.setMessage("Login Fail");
		}
		return js;
	}

}

