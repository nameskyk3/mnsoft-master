package com.mobigen.framework.menu;

import lombok.Data;

@Data
public class MenuVO {
	private int menNum;
	private int menParent;
	private String menName;
	private String menTarget;

}
