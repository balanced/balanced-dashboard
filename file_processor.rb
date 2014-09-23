a = Dir.glob("app/**/*.js")

a.each do |file_name|
	contents = File.read(file_name)
	if contents =~ /Balanced\.computed/
		puts file_name + " matches"
	end
end
