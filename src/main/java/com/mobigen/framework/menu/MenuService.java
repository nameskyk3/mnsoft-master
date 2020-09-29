package com.mobigen.framework.menu;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MenuService {
	@Autowired
	public MenuMapper mapper;
	
	public List<MenuVO> getMenuList() throws Exception{
		return mapper.getMenuList();
	}

}
