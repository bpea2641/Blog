package com.Blog.myBlog.Member;

import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;

@Getter
@Setter
public class CustomUser extends User implements Serializable {

    private static final long serialVersionUID = 1L;

    private String displayName;
    private Long id;
    private String profileImage; // ✅ 이거 추가!

    public CustomUser(String username, String password,
                      Collection<? extends GrantedAuthority> authorities,
                      String displayName, Long id, String profileImage) {
        super(username, password == null ? "" : password, authorities);
        this.displayName = displayName;
        this.id = id;
        this.profileImage = profileImage; // ✅ 세팅
    }

    public CustomUser(String username, String password, List<SimpleGrantedAuthority> authorities) {
        super(username, password, authorities);
    }

    @Override
    public String toString() {
        return "CustomUser{" +
                "username=" + getUsername() +
                ", id=" + id +
                ", displayName=" + displayName +
                ", profileImage=" + profileImage + // ✅ 출력에도 포함하면 디버깅에 좋아요
                '}';
    }
}


