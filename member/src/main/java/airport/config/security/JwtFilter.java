package airport.config.security;

import io.jsonwebtoken.Claims;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import airport.domain.User.CustomUser;

import java.io.IOException;
import java.util.Arrays;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Component
public class JwtFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // 1.JWW 이름의 쿠키가 있으면 꺼내서
        Cookie[] cookies = request.getCookies();
        if (cookies == null){
            // 다음필터실행
            filterChain.doFilter(request, response);
            return;
        }
        var jwtCookie = "";
        for (int i = 0; i < cookies.length; i++){
            if (cookies[i].getName().equals("jwt")){
                jwtCookie = cookies[i].getValue();
            }
        }
        // 2. 유효기간, 위조여부등 확인해보고
        Claims claim;
        try{
            claim = jwtUtil.extractToken(jwtCookie);
        } catch (Exception e) {
            filterChain.doFilter(request, response);
            return;
        }
        // 3. 문제없으면 auth 변수에 유저정보 넣어줌
        var arr = claim.get("authorities").toString().split(",");
        var authorities = Arrays.stream(arr)
            .map(a -> new SimpleGrantedAuthority(a))
            .collect(Collectors.toList());

        var customUser = new CustomUser(
                claim.get("username").toString(),
                "none",
                authorities
        );


        var authToken = new UsernamePasswordAuthenticationToken(
                customUser, "", authorities
        );
        // auth 등록
        authToken.setDetails(new WebAuthenticationDetailsSource()
                .buildDetails(request)
        );
        SecurityContextHolder.getContext().setAuthentication(authToken);
        //요청들어올때마다 실행할코드~~
        filterChain.doFilter(request, response);
    }


}
