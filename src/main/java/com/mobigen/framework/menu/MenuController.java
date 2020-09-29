package com.mobigen.framework.menu;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.mobigen.framework.result.JsonResult;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/menu")
public class MenuController {
	 
	 @Autowired
	 private MenuMapper menuService;
	 
	 @RequestMapping(value = "/list", method = RequestMethod.GET)
	 public JsonResult getMenuList() throws Exception {
	     JsonResult result = new JsonResult();
	     List list = menuService.getMenuList();
	     result.setData(list);
	     result.setResult(1); //성공 코드
	     return result;

	 }
	 @RequestMapping(value = "/add", method = RequestMethod.POST)
	    JsonResult addDivision(@RequestBody HashMap body) throws Exception {
	        // 뒤에 디비 연동로직을 찾아해보세요
	        log.debug(body.toString());

	        JsonResult result = new JsonResult();
	        result.setData("success");
	        result.setResult(1);
	        return result;

	    }

}
