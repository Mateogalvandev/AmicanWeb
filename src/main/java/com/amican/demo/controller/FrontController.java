package com.amican.demo.controller;

import com.amican.demo.dto.UserDto;
import com.amican.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class FrontController {


    @GetMapping("/")
    public String inicio(){
        return "index";
    }

    @GetMapping("/home")
    public String inicioHome(){
        return "index";
    }


}
